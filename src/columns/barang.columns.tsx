import { Button, Tooltip, Popconfirm, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MdDelete, MdEdit } from "react-icons/md";

export const barangColumns: (pagination: {
  current: number;
  pageSize: number;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
}) => ColumnsType<any> = ({ current, pageSize, onDelete, onEdit }) => [
  {
    key: "no",
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>NO.</span>,
    align: "center",
    render: (_, __, index) => (
      <span style={{ fontSize: 16 }}>
        {(current - 1) * pageSize + index + 1}
      </span>
    ),
  },
  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Nama Barang</span>,
    dataIndex: "nama_barang",
    key: "nama_barang",
    align: "center",
    render: (text) => <span style={{ fontSize: 16 }}>{text || "-"}</span>,
  },
  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Kategori</span>,
    dataIndex: "kategori",
    key: "kategori",
    align: "center",
    render: (text) => <span style={{ fontSize: 16 }}>{text || "-"}</span>,
  },
  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Stok</span>,
    dataIndex: "stok",
    key: "stok",
    align: "center",
    render: (text) => <span style={{ fontSize: 16 }}>{text}</span>,
  },
  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Kondisi</span>,
    dataIndex: "kondisi",
    key: "kondisi",
    align: "center",
    render: (text) => (
      <span
        className={`px-3 py-1 rounded text-[15px] font-medium ${
          text?.toLowerCase() === "baik"
            ? "bg-green-100 text-green-700"
            : text?.toLowerCase() === "rusak"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {text || "-"}
      </span>
    ),
  },
  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Gambar</span>,
    dataIndex: "path_img",
    key: "path_img",
    align: "center",
    render: (path) => {
      if (!path) return <span style={{ fontSize: 15 }}>-</span>;

      const imageUrl = path.startsWith("http")
        ? path
        : `http://localhost:2021/${path}`;

      return (
        <Image
          src={imageUrl}
          alt="barang"
          width={70}
          height={70}
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="https://via.placeholder.com/60?text=No+Image"
        />
      );
    },
  },
  {
    key: "uuid",
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>AKSI</span>,
    dataIndex: "uuid",
    align: "center",
    render: (value, record) => (
      <div className="flex justify-center space-x-3">
        <Tooltip title="Edit">
          <Button htmlType="button" type="text" onClick={() => onEdit(value)}>
            <MdEdit className="text-xl text-blue-600" />
          </Button>
        </Tooltip>

        <Popconfirm
          title={`Yakin menghapus barang "${record.nama_barang}"?`}
          onConfirm={() => onDelete(value)}
          okText="Ya"
          cancelText="Tidak"
        >
          <Tooltip title="Hapus">
            <Button htmlType="button" type="text">
              <MdDelete className="text-xl text-red-600" />
            </Button>
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];
