import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { getThumbnailUrl } from "../../services/cloudinaryService";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-4 border-b border-[#1c1c1c] text-left">
      {/* Thumbnail */}
      <div className="w-20 h-24 bg-[#141414] border border-[#262626] overflow-hidden flex-shrink-0">
        <img
          src={getThumbnailUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#e8e4d9] line-clamp-1">
              {item.name}
            </h4>
            <button
              onClick={() => onRemove(item.itemKey)}
              className="text-[#666] hover:text-red-400 transition-colors p-1"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#181818] border border-[#282828] text-[#b3b0a6]">
              {item.size}
            </span>
            {item.color && (
              <span className="text-[10px] tracking-wider text-[#777]">
                {item.color}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Quantity selector */}
          <div className="inline-flex items-center border border-[#2a2a2a] bg-[#111]">
            <button
              onClick={() => onUpdateQuantity(item.itemKey, item.quantity - 1)}
              className="px-2 py-1 text-[#8e8b83] hover:text-[#e8e4d9] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 py-1 text-xs font-mono text-[#e8e4d9]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.itemKey, item.quantity + 1)}
              className="px-2 py-1 text-[#8e8b83] hover:text-[#e8e4d9] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <p className="font-medium text-xs text-[#e8e4d9]">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
