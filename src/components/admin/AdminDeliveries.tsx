import React, { useState } from 'react';
import { Truck, MapPin, Calendar, Clock, CheckCircle2, Edit2, Plus, Trash2, Save } from 'lucide-react';
import { Order, DeliveryZone, ShopSettings, OrderStatus } from '../../types';
import { formatFCFA } from '../../services/storage';

interface AdminDeliveriesProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  settings: ShopSettings;
  onUpdateSettings: (settings: ShopSettings) => void;
}

export const AdminDeliveries: React.FC<AdminDeliveriesProps> = ({
  orders,
  onUpdateOrderStatus,
  settings,
  onUpdateSettings
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [editingZones, setEditingZones] = useState<DeliveryZone[]>(settings.deliveryZones || []);
  const [showZoneConfig, setShowZoneConfig] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Orders that need delivery or are active
  const ordersToDeliver = orders.filter((o) => {
    const isOngoing =
      o.status === 'nouvelle' ||
      o.status === 'en_attente' ||
      o.status === 'confirmee' ||
      o.status === 'en_preparation' ||
      o.status === 'en_livraison' ||
      o.status === 'shipping' ||
      o.status === 'pending' ||
      o.status === 'confirmed';

    if (!isOngoing) return false;
    if (filterRegion !== 'all' && o.customer.region !== filterRegion) return false;
    return true;
  });

  const handleSaveZones = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...settings, deliveryZones: editingZones };
    onUpdateSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleUpdateFee = (zoneId: string, newFee: number) => {
    setEditingZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, fee: Number(newFee) } : z))
    );
  };

  const handleUpdateDelay = (zoneId: string, delay: string) => {
    setEditingZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, delay } : z))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Gestion des Expéditions & Livraisons Sénégal
          </h2>
          <p className="text-xs text-[#5C3D2E]">
            Suivez les courses à Dakar et les expéditions régionales (Thiès, Saint-Louis, Mbour, Touba, etc.).
          </p>
        </div>

        <button
          onClick={() => setShowZoneConfig(!showZoneConfig)}
          className="px-4 py-2 bg-white border border-[#DEBF6D] text-[#2C1810] hover:bg-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Edit2 className="w-4 h-4 text-[#A8813C]" />
          <span>{showZoneConfig ? 'Masquer Tarifs Zones' : 'Configurer Tarifs & Zones'}</span>
        </button>
      </div>

      {/* Zone Configuration Drawer / Form */}
      {showZoneConfig && (
        <form onSubmit={handleSaveZones} className="bg-white p-6 rounded-2xl border border-[#DEBF6D] shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#EFE8DA] pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2C1810]">
                Grille des Frais de Livraison au Sénégal
              </h3>
              <p className="text-[11px] text-[#5C3D2E]">
                Ces frais sont appliqués automatiquement aux paniers des clients avant validation.
              </p>
            </div>
            {savedNotice && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                Frais enregistrés avec succès !
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editingZones.map((zone) => (
              <div key={zone.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DA] space-y-2">
                <span className="font-bold text-[#2C1810] block">{zone.name}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#5C3D2E] block">Tarif (FCFA) :</label>
                    <input
                      type="number"
                      value={zone.fee}
                      onChange={(e) => handleUpdateFee(zone.id, Number(e.target.value))}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-2.5 py-1 font-bold text-[#2C1810]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#5C3D2E] block">Délai indicatif :</label>
                    <input
                      type="text"
                      value={zone.delay}
                      onChange={(e) => handleUpdateDelay(zone.id, e.target.value)}
                      className="w-full bg-white border border-[#EFE8DA] rounded-lg px-2.5 py-1 text-[#2C1810]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2C1810] text-[#DEBF6D] hover:bg-[#3E2419] rounded-xl font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer la grille tarifaire</span>
            </button>
          </div>
        </form>
      )}

      {/* Orders To Deliver */}
      <div className="bg-white rounded-2xl border border-[#EFE8DA] shadow-xs p-5 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-base text-[#2C1810]">
            Colis en Cours de Traitement & Livraison ({ordersToDeliver.length})
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[#5C3D2E]">Région :</span>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-[#FAF7F2] border border-[#EFE8DA] rounded-xl px-3 py-1.5 text-xs text-[#2C1810] focus:outline-none"
            >
              <option value="all">Toutes les zones</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#EFE8DA]">
          {ordersToDeliver.length === 0 ? (
            <p className="py-8 text-center text-[#5C3D2E]/60">
              Toutes les livraisons en cours sont terminées !
            </p>
          ) : (
            ordersToDeliver.map((order) => (
              <div key={order.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1810] text-sm">#{order.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A8813C]/20 text-[#2C1810]">
                      {order.customer.region}
                    </span>
                    <span className="text-[11px] text-[#5C3D2E]">
                      Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <p className="font-medium text-[#2C1810]">
                    Destinataire : {order.customer.fullName} ({order.customer.phone})
                  </p>

                  <p className="text-[#5C3D2E] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A8813C]" />
                    <span>{order.customer.cityOrArea}, {order.customer.address}</span>
                  </p>

                  <p className="text-[11px] text-[#A8813C]">
                    Articles : {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-[#2C1810] block tabular-nums">
                      {formatFCFA(order.total)}
                    </span>
                    <span className="text-[10px] uppercase text-[#5C3D2E]">
                      Frais : {formatFCFA(order.deliveryFee)}
                    </span>
                  </div>

                  {/* Quick deliver toggle button */}
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'livree')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Marquer comme livré avec succès"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marquer Livré</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
