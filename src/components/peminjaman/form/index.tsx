import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
  Card,
  Space,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchBarang } from "../../../utils/apis";
import dayjs from "dayjs";

interface PeminjamanFormProps {
  initialValues?: any; 
  onSubmit: (formData: FormData) => void;
  mode: "create" | "edit";
}

const PeminjamanForm: React.FC<PeminjamanFormProps> = ({
  initialValues,
  onSubmit,
  mode,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [barangList, setBarangList] = useState<any[]>([]);

  useEffect(() => {
    const fetchBarangs = async () => {
      try {
        const res = await fetchBarang();
        const list = res?.data?.data || res?.data?.response || res?.data || [];
        setBarangList(list);
      } catch (err) {
        console.error("Gagal memuat barang:", err);
        message.error("Gagal memuat daftar barang.");
      }
    };
    fetchBarangs();
  }, []);

  useEffect(() => {
    if (initialValues) {
      const pdfList = initialValues.path_file_peminjaman
        ? [
            {
              uid: "-1",
              name: "surat-peminjaman.pdf",
              status: "done",
              url: initialValues.path_file_peminjaman,
            },
          ]
        : [];

      form.setFieldsValue({
        nama_peminjam: initialValues.nama_peminjam,
        barang_id: initialValues.barang_id,
        jumlah: initialValues.jumlah,
        tanggal_pinjam: initialValues.tanggal_pinjam
          ? dayjs(initialValues.tanggal_pinjam)
          : null,
        tanggal_kembali_direncanakan:
          initialValues.tanggal_kembali_direncanakan
            ? dayjs(initialValues.tanggal_kembali_direncanakan)
            : null,
        file_surat: pdfList,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const formData = new FormData();

    // field-text biasa
    formData.append("nama_peminjam", values.nama_peminjam);
    formData.append("barang_id", values.barang_id);
    formData.append("jumlah", values.jumlah);
    formData.append(
      "tanggal_pinjam",
      values.tanggal_pinjam.format("YYYY-MM-DD")
    );
    formData.append(
      "tanggal_kembali_direncanakan",
      values.tanggal_kembali_direncanakan.format("YYYY-MM-DD")
    );

    // 🔹 file PDF wajib
    if (values.file_surat && values.file_surat[0]) {
      const pdfObj = values.file_surat[0].originFileObj;
      if (pdfObj) {
        formData.append("file", pdfObj); // API backend expects req.files.file
      }
    }

    onSubmit(formData);
  };

  return (
    <Card>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Nama Peminjam"
          name="nama_peminjam"
          rules={[{ required: true, message: "Nama peminjam wajib diisi" }]}
        >
          <Input placeholder="Masukkan nama peminjam" />
        </Form.Item>

        <Form.Item
          label="Barang"
          name="barang_id"
          rules={[{ required: true, message: "Pilih barang yang dipinjam" }]}
        >
          <Select placeholder="Pilih barang">
            {barangList.map((b) => (
              <Select.Option key={b.uuid} value={b.id}>
                {b.nama_barang}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Jumlah"
          name="jumlah"
          rules={[{ required: true, message: "Masukkan jumlah barang" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tanggal Pinjam"
          name="tanggal_pinjam"
          rules={[{ required: true, message: "Tanggal pinjam wajib diisi" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tanggal Kembali (Rencana)"
          name="tanggal_kembali_direncanakan"
          rules={[{ required: true, message: "Tanggal kembali wajib diisi" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* 🔥 Upload SURAT PEMINJAMAN PDF */}
        <Form.Item
          label="Upload Surat Peminjaman (PDF)"
          name="file_surat"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Surat peminjaman wajib diupload!" }]}
        >
          <Upload
            beforeUpload={(file) => {
              const isPdf = file.type === "application/pdf";
              if (!isPdf) {
                message.error("Hanya file PDF yang diizinkan.");
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            accept="application/pdf"
            maxCount={1}
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Upload PDF</Button>
          </Upload>
        </Form.Item>

        <Space className="w-full flex justify-between">
          <Button onClick={() => navigate("/admin/peminjaman")}>Kembali</Button>
          <Button type="primary" htmlType="submit">
            {mode === "edit" ? "Update" : "Simpan"}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default PeminjamanForm;
