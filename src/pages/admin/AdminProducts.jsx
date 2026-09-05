import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getThumbnailUrl } from "../../services/cloudinaryService";
import { formatCurrency } from "../../utils/formatters";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    const data = await getProducts({ onlyActive: false });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    setShowAddModal(false);
    fetchCatalog();
  };

  const handleUpdate = async (payload) => {
    await updateProduct(editingProduct.id || editingProduct.slug, payload);
    setEditingProduct(null);
    fetchCatalog();
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      await deleteProduct(productId);
      fetchCatalog();
    }
  };

  const handleToggleActive = async (product) => {
    await updateProduct(product.id || product.slug, { isActive: !product.isActive });
    fetchCatalog();
  };

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
          <div>
            <h2 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#e8e4d9]">
              Streetwear Catalog ({products.length})
            </h2>
            <p className="text-xs text-[#777]">
              Manage drops, Cloudinary image assets, pricing, and variant inventory.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add New Drop
          </Button>
        </div>

        {/* Product Table */}
        <div className="bg-[#0c0c0c] border border-[#222] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111] text-[#777] uppercase tracking-wider border-b border-[#1c1c1c]">
              <tr>
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {products.map((p) => (
                <tr key={p.id || p.slug} className="hover:bg-[#111]/40 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={getThumbnailUrl(p.images?.[0]?.url || "/logo.jpg")}
                      alt=""
                      className="w-10 h-12 object-cover border border-[#222]"
                    />
                    <div>
                      <span className="font-semibold text-[#e8e4d9] block line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-[#666] font-mono">{p.slug}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#8e8b83]">{p.category}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#e8e4d9]">{formatCurrency(p.price)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono ${p.stock <= 5 ? "text-red-400 font-bold" : "text-[#8e8b83]"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 border ${
                        p.isActive
                          ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                          : "bg-[#181818] text-[#777] border-[#2a2a2a]"
                      }`}
                    >
                      {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{p.isActive ? "Active" : "Archived"}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-[#8e8b83] hover:text-[#e8e4d9] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id || p.slug)}
                        className="p-1.5 text-[#666] hover:text-red-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Streetwear Drop"
          maxWidth="max-w-4xl"
        >
          <ProductForm
            onSave={handleCreate}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <Modal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          title={`Edit Drop: ${editingProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <ProductForm
            initialData={editingProduct}
            onSave={handleUpdate}
            onCancel={() => setEditingProduct(null)}
          />
        </Modal>
      )}
    </AdminLayout>
  );
}
