import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Typography, Space, Grid } from "antd";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/plots";

import {
  getRiwayatPeminjaman,
  fetchBarang,
  riwayat,
} from "../../../utils/apis";
import { AdminLayout } from "../../../layouts";

const { Content } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const Dashboard: React.FC = () => {
  const screens = useBreakpoint();
  const isSm = !!screens.sm; // responsive

  const [totalBarang, setTotalBarang] = useState<number>(0);
  const [peminjamanAktif, setPeminjamanAktif] = useState<number>(0);
  const [barangKembali, setBarangKembali] = useState<number>(0);
  const [barangHilang, setBarangHilang] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const barangRes = await fetchBarang();
        const pinjamRes = await getRiwayatPeminjaman();
        const riwayatRes = await riwayat();

        const barangList = barangRes?.data?.response || barangRes?.data || [];
        const pinjamList = pinjamRes?.data?.response || pinjamRes?.data || [];
        const riwayatList =
          riwayatRes?.data?.response || riwayatRes?.data || [];

        setTotalBarang(barangList.length);
        setPeminjamanAktif(
          pinjamList.filter((i: any) => i.status === "dipinjam").length
        );
        setBarangKembali(
          riwayatList.filter((i: any) => i.status === "dikembalikan").length
        );
        setBarangHilang(
          riwayatList.filter((i: any) => i.status === "hilang").length
        );
      } catch (err) {
        console.error("Gagal load data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Chart Data
  const chartData = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 15 },
    { month: "Mar", value: 8 },
    { month: "Apr", value: 22 },
    { month: "May", value: 30 },
    { month: "Jun", value: 25 },
  ];

  const chartConfig = {
    data: chartData,
    xField: "month",
    yField: "value",
    smooth: true,
    height: isSm ? 280 : 220,
    color: "#2563eb",
    point: { size: 4 },
    areaStyle: { fill: "l(270) 0:#3b82f6 1:#93c5fd" },
  };

  // STYLE VARIABLES (lebih kecil & rapih)
  const cardBase: React.CSSProperties = {
    borderRadius: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    minHeight: 145,
    display: "flex",
    alignItems: "center",
  };

  const iconBox = (bg: string) => ({
    width: isSm ? 58 : 48,
    height: isSm ? 58 : 48,
    borderRadius: 12,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const iconSize = (color: string = "#fff") => ({
    fontSize: isSm ? 26 : 22,
    color,
  });

  const numberStyle: React.CSSProperties = {
    fontSize: isSm ? 34 : 28,
    fontWeight: 900,
    lineHeight: 1,
  };

  return (
    <AdminLayout>
      <Content style={{ padding: isSm ? 20 : 24 }}>
        <Row gutter={[16, 16]}>

          {/* TOTAL BARANG */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              bodyStyle={{ padding: 16 }}
              style={{
                ...cardBase,
                background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "#fff",
              }}
            >
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space size={14}>
                  <div style={iconBox("rgba(255,255,255,0.15)")}>
                    <ShoppingOutlined style={iconSize()} />
                  </div>
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>
                    Total Barang
                  </Text>
                </Space>

                <Text style={numberStyle}>{totalBarang}</Text>
              </Space>
            </Card>
          </Col>

          {/* PEMINJAMAN AKTIF */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              bodyStyle={{ padding: 16 }}
              style={{
                ...cardBase,
                background: "linear-gradient(135deg,#10b981,#34d399)",
                color: "#fff",
              }}
            >
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space size={14}>
                  <div style={iconBox("rgba(255,255,255,0.15)")}>
                    <ClockCircleOutlined style={iconSize()} />
                  </div>
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>
                    Peminjaman Aktif
                  </Text>
                </Space>

                <Text style={numberStyle}>{peminjamanAktif}</Text>
              </Space>
            </Card>
          </Col>

          {/* DIKEMBALIKAN */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              bodyStyle={{ padding: 16 }}
              style={{
                ...cardBase,
                background: "linear-gradient(135deg,#facc15,#fde047)",
                color: "#1f2937",
              }}
            >
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space size={14}>
                  <div style={iconBox("rgba(0,0,0,0.06)")}>
                    <CheckCircleOutlined
                      style={iconSize("#92400e")}
                    />
                  </div>
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>
                    Dikembalikan
                  </Text>
                </Space>

                <Text style={numberStyle}>{barangKembali}</Text>
              </Space>
            </Card>
          </Col>

          {/* BARANG HILANG */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              loading={loading}
              bodyStyle={{ padding: 16 }}
              style={{
                ...cardBase,
                background: "linear-gradient(135deg,#ef4444,#f87171)",
                color: "#fff",
              }}
            >
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space size={14}>
                  <div style={iconBox("rgba(255,255,255,0.15)")}>
                    <WarningOutlined style={iconSize()} />
                  </div>
                  <Text style={{ fontSize: 16, fontWeight: 700 }}>
                    Barang Hilang
                  </Text>
                </Space>

                <Text style={numberStyle}>{barangHilang}</Text>
              </Space>
            </Card>
          </Col>

        </Row>

        {/* CHART */}
        <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              title={
                <Title level={4} style={{ margin: 0 }}>
                  📊 Tren Peminjaman Barang
                </Title>
              }
              style={{
                borderRadius: 14,
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: isSm ? 20 : 14 }}
            >
              <Line {...chartConfig} />
            </Card>
          </Col>
        </Row>
      </Content>
    </AdminLayout>
  );
};

export default Dashboard;
