import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import OrderVerificationModal from "../../components/admin/OrderVerificationModal";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { getOrders, verifyPayment, rejectPayment, updateOrderStatus } from "../../services/orderService";
import { getProducts, seedProductsToFirestore } from "../../services/productService";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [ordersData, prodsData] = await Promise.all([
      getOrders({ statusFilter: "all" }),
      getProducts({ onlyActive: false })
    ]);
    setOrders(ordersData);
    setProducts(prodsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingPayments = orders.filter((o) => o.paymentStatus === "submitted" || o.paymentStatus === "pending");
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 5);
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "verified")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await seedProductsToFirestore();
      setSeedSuccess(res.message);
      await fetchData();
      setTimeout(() => setSeedSuccess(""), 4000);
    } catch (e) {
      alert("Seeding error: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayout title="Overview & Performance">
      <div className="space-y-8 text-left">
        {/* Seed helper banner */}
        <div className="p-4 bg-[#111] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#e8e4d9]">
                Firestore Catalog Seeder
              </h4>
              <p className="text-[11px] text-[#777]">
                Populate Firestore with official Lost Label sample products and store settings with 1 click.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {seedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {seedSuccess}
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              loading={seeding}
              onClick={handleSeedDatabase}
            >
              Seed Products
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0c0c0c] border border-[#222] space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#777]">Total Verified Revenue</span>
            <p className="font-cinzel text-2xl font-bold text-[#e8e4d9]">{formatCurrency(totalRevenue)}</p>
          </div>

          <div className="p-5 bg-[#0c0c0c] border border-[#222] space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#777]">Total Orders</span>
            <p className="font-cinzel text-2xl font-bold text-[#e8e4d9]">{orders.length}</p>
          </div>

          <div className="p-5 bg-[#0c0c0c] border border-[#222] space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#777]">Pending Payments</span>
            <p className="font-cinzel text-2xl font-bold text-amber-400">{pendingPayments.length}</p>
          </div>

          <div className="p-5 bg-[#0c0c0c] border border-[#222] space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#777]">Active Catalog Drops</span>
            <p className="font-cinzel text-2xl font-bold text-[#e8e4d9]">{products.length}</p>
          </div>
        </div>

        {/* Pending Payments Action Queue */}
        <div className="bg-[#0c0c0c] border border-[#222] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e8e4d9]">
                Payments Requiring Verification ({pendingPayments.length})
              </h3>
            </div>
            <Link to="/admin/orders" className="text-xs uppercase tracking-widest text-[#8e8b83] hover:text-[#e8e4d9]">
              View All Orders →
            </Link>
          </div>

          {pendingPayments.length === 0 ? (
            <p className="text-xs text-[#666] py-6 text-center italic">
              All payment submissions have been audited. No pending queues.
            </p>
          ) : (
            <div className="divide-y divide-[#181818]">
              {pendingPayments.map((order) => (
                <div key={order.id || order.orderNumber} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#e8e4d9]">{order.orderNumber}</span>
                      <Badge variant={order.paymentStatus === "submitted" ? "submitted" : "pending"}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-[#777] mt-0.5">
                      Customer: {order.customerName} ({order.phone}) • UTR:{" "}
                      <strong className="text-[#e8e4d9] font-mono">{order.transactionId || "Awaiting"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm text-[#e8e4d9]">
                      {formatCurrency(order.total)}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Audit & Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watch */}
        {lowStockProducts.length > 0 && (
          <div className="bg-[#0c0c0c] border border-amber-900/40 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1c1c1c]">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-cinzel text-sm uppercase tracking-widest text-amber-300">
                Low Inventory Alerts ({lowStockProducts.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map((p) => (
                <div key={p.id || p.slug} className="p-3 bg-[#111] border border-[#222] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-[#e8e4d9] line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-[#777] uppercase">{p.category}</p>
                  </div>
                  <span className="text-rose-400 font-mono font-bold">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audit Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Audit Order: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <OrderVerificationModal
            order={selectedOrder}
            onVerify={async (id) => {
              await verifyPayment(id);
              fetchData();
            }}
            onReject={async (id, reason) => {
              await rejectPayment(id, reason);
              fetchData();
            }}
            onUpdateStatus={async (id, status) => {
              await updateOrderStatus(id, status);
              fetchData();
            }}
            onClose={() => setSelectedOrder(null)}
          />
        </Modal>
      )}
    </AdminLayout>
  );
}
