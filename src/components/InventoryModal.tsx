import React, { useState } from 'react';
import { X, Backpack, Wrench, Droplet, Utensils, Heart, Battery, Package, Plus } from 'lucide-react';
import { Item, Recipe } from '../types/game';

interface InventoryModalProps {
  items: Item[];
  recipes: Recipe[];
  onUseItem: (item: Item) => void;
  onCraftRecipe: (recipe: Recipe) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = React.memo(({
  items,
  recipes,
  onUseItem,
  onCraftRecipe,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'craft'>('items');

  // Check if player has enough materials for a recipe
  const canCraftRecipe = (recipe: Recipe) => {
    return recipe.ingredients.every((ing) => {
      const foundItem = items.find((it) => it.id === ing.itemId);
      return foundItem && foundItem.quantity >= ing.qty;
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="w-5 h-5 text-[#4A90E2]" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-[#E5A93C]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#48BB78]" />;
      case 'Battery': return <Battery className="w-5 h-5 text-[#F4C458]" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-[#9d8f7c]" />;
      default: return <Package className="w-5 h-5 text-[#e2e2ea]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-barlow">
      <div className="max-w-3xl w-full bg-[#191b21] border border-[#282a30] p-5 sm:p-6 chamfer-panel shadow-2xl space-y-4 relative ink-border">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282a30] pb-3">
          <div className="flex items-center gap-2">
            <Backpack className="w-6 h-6 text-[#E5A93C]" />
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F4C458]">
              SUPRIMENTOS & BANCADA DE TRABALHO
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#111319] hover:bg-[#282a30] text-[#9DA3AE] hover:text-[#e2e2ea] border border-[#282a30] rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#282a30]">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 font-space-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'items'
                ? 'border-[#E5A93C] text-[#E5A93C] bg-[#111319]'
                : 'border-transparent text-[#9DA3AE] hover:text-[#e2e2ea]'
            }`}
          >
            INVENTÁRIO ({items.reduce((acc, it) => acc + it.quantity, 0)} ITENS)
          </button>

          <button
            onClick={() => setActiveTab('craft')}
            className={`px-4 py-2 font-space-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'craft'
                ? 'border-[#F4C458] text-[#F4C458] bg-[#111319]'
                : 'border-transparent text-[#9DA3AE] hover:text-[#e2e2ea]'
            }`}
          >
            FABRICAÇÃO / BANCADA
          </button>
        </div>

        {/* TAB 1: INVENTORY ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="p-8 text-center bg-[#111319] border border-[#282a30] text-[#9DA3AE] font-space-mono text-sm">
                Nenhum suprimento no inventário. Vasculhe os cômodos da casa.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#111319] border border-[#282a30] hover:border-[#E5A93C]/50 p-3.5 rounded flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#191b21] border border-[#282a30] rounded shrink-0">
                        {getIcon(item.iconName)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#e2e2ea]">{item.name}</h4>
                          <span className="text-xs font-space-mono font-bold text-[#E5A93C] bg-[#191b21] px-1.5 py-0.2 border border-[#282a30]">
                            x{item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-[#9DA3AE] leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {item.usable && item.quantity > 0 && (
                      <button
                        onClick={() => onUseItem(item)}
                        className="bg-[#E5A93C] hover:bg-[#F4C458] text-[#111319] text-xs font-bold px-3 py-1.5 chamfer-btn shrink-0 cursor-pointer uppercase transition-transform active:scale-95"
                      >
                        USAR
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CRAFTING WORKBENCH */}
        {activeTab === 'craft' && (
          <div className="space-y-3">
            <p className="text-xs font-space-mono text-[#9DA3AE]">
              Combine materiais encontrados pela casa para construir ferramentas de defesa e sobrevivência:
            </p>

            <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {recipes.map((recipe) => {
                const craftable = canCraftRecipe(recipe);

                return (
                  <div
                    key={recipe.id}
                    className={`bg-[#111319] border p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      craftable ? 'border-[#48BB78]/40 hover:border-[#48BB78]' : 'border-[#282a30] opacity-75'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-[#F4C458] flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#E5A93C]" />
                        {recipe.name}
                      </h4>
                      <p className="text-xs text-[#9DA3AE]">{recipe.description}</p>

                      {/* Ingredients list */}
                      <div className="flex items-center gap-3 pt-1 text-xs font-space-mono text-[#9DA3AE]">
                        <span>Ingredientes:</span>
                        {recipe.ingredients.map((ing) => {
                          const itemInInv = items.find((it) => it.id === ing.itemId);
                          const currentQty = itemInInv ? itemInInv.quantity : 0;
                          const hasEnough = currentQty >= ing.qty;

                          return (
                            <span
                              key={ing.itemId}
                              className={`px-1.5 py-0.5 border ${
                                hasEnough ? 'text-[#48BB78] border-[#48BB78]/30 bg-[#48BB78]/10' : 'text-[#D64045] border-[#D64045]/30 bg-[#D64045]/10'
                              }`}
                            >
                              {ing.itemId} ({currentQty}/{ing.qty})
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      disabled={!craftable}
                      onClick={() => onCraftRecipe(recipe)}
                      className={`px-4 py-2 chamfer-btn font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer transition-all ${
                        craftable
                          ? 'bg-[#48BB78] hover:bg-[#58cc88] text-[#111319] shadow-md'
                          : 'bg-[#282a30] text-[#4F5563] cursor-not-allowed'
                      }`}
                    >
                      FABRICAR
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

InventoryModal.displayName = 'InventoryModal';
