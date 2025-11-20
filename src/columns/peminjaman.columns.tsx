import React from "react";
import type { ColumnsType } from "antd/es/table";
import { Select, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";

export const peminjamanColumns: (opts: {
  current: number;
  pageSize: number;
  onStatusChange?: (id: string, status: string) => void;
}) => ColumnsType<any> = ({ current, pageSize, onStatusChange }) => [
  {
    key: "no",
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>No.</span>,
    align: "center",
    render: (_, __, index) => (
      <span style={{ fontSize: 16 }}>
        {(current - 1) * pageSize + index + 1}
      </span>
    ),
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Nama Peminjam</span>,
    dataIndex: "nama_peminjam",
    key: "nama_peminjam",
    align: "left",
    render: (text) => <span style={{ fontSize: 16 }}>{text || "-"}</span>,
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Nama Barang</span>,
    dataIndex: "barang_name",
    key: "barang_name",
    align: "left",
    render: (text) => <span style={{ fontSize: 16 }}>{text || "-"}</span>,
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Jumlah</span>,
    dataIndex: "jumlah",
    key: "jumlah",
    align: "center",
    render: (text) => <span style={{ fontSize: 16 }}>{text || "-"}</span>,
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Tanggal Pinjam</span>,
    dataIndex: "tanggal_pinjam",
    key: "tanggal_pinjam",
    align: "center",
    render: (val: string) => (
      <span style={{ fontSize: 16 }}>
        {val ? dayjs(val).format("YYYY-MM-DD") : "-"}
      </span>
    ),
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>File Peminjaman</span>,
    dataIndex: "path_file_peminjaman",
    key: "path_file_peminjaman",
    align: "center",
    render: (url: string) => {
      if (!url)
        return <span style={{ fontSize: 16 }}>-</span>;

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaFilePdf
            size={28}
            color="#d32f2f"
            style={{ cursor: "pointer" }}
            title="Lihat PDF"
          />
        </a>
      );
    },
  },

  {
    title: <span style={{ fontSize: 16, fontWeight: 600 }}>Status</span>,
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (value: string, record: any) => {
      const handleChange = async (newStatus: string) => {
        try {
          if (onStatusChange) {
            onStatusChange(record.uuid, newStatus);
          } else {
            await axios.put(`/api/peminjaman/${record.uuid}`, {
              status: newStatus,
            });
            message.success("Status berhasil diperbarui");
          }
        } catch (err) {
          console.error(err);
          message.error("Gagal memperbarui status");
        }
      };

      return (
        <Select
          value={value}
          style={{ width: 160, fontSize: 16 }}
          dropdownStyle={{ fontSize: 16 }}
          onChange={handleChange}
          options={[
            { label: "Dipinjam", value: "dipinjam" },
            { label: "Hilang", value: "hilang" },
            { label: "Dikembalikan", value: "dikembalikan" },
          ]}
        />
      );
    },
  },
];
