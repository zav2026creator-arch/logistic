import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapController = ({ selectedOrder }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedOrder) {
      // Плавно перемещаемся к координатам заказа
      // [lat, lng], zoom level, options
      map.flyTo([selectedOrder.lat, selectedOrder.lng], 8, {
        duration: 1.5, // Длительность анимации в секундах
        easeLinearity: 0.25
      });
    }
  }, [selectedOrder, map]);

  return null;
};

export default MapController;