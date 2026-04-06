import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation & General
      map: "Map",
      orders: "Orders",
      logout: "Logout",
      details: "Details",
      found: "Found",
      total: "total",
      
      // Orders Page & Form
      create_title: "Post New Load",
      btn_publish: "Publish Tender",
      active_shipments: "Active Shipments",
      placeholder_cargo: "Cargo Name (e.g. Spare Parts)",
      placeholder_from: "From (City)",
      placeholder_to: "To (City)",
      placeholder_desc: "Additional description...",
      placeholder_vehicle: "Vehicle type (e.g. Tilt 20t)",
      search_city: "Search city...",
      all_statuses: "All statuses",
      confirm_delete: "Are you sure you want to delete this order?",
      
      // Table & Labels
      label_cargo: "Cargo",
      label_weight: "Weight (kg)",
      label_weight_short: "kg",
      label_volume: "Volume (m³)",
      label_vehicle: "Vehicle Type",
      label_distance: "Distance",
      label_price: "Budget",
      label_description: "Comments",
      label_published: "Published",
      label_route: "Route",
      label_params: "Parameters",
      label_status: "Status",
      label_actions: "Actions",
      
      // Units & Info
      unit_currency: "€",
      unit_kg: "kg",
      unit_m3: "m³",
      unit_km: "km",
      unit_km_straight: "km straight",
      vehicle_any: "Any vehicle",
      no_description: "No additional requirements.",
      date_n_a: "N/A",
      nothing_found: "Nothing found",
      no_orders: "No orders yet",

      // Statuses
      status_pending: "Pending",
      status_in_transit: "In Transit",
      status_delivered: "Delivered",

      // Actions
      btn_accept: "Accept This Load",
      btn_close: "Close",
      order_accepted_title: "Order Accepted!",
      order_accepted_desc: "Contact the customer to clarify details",
      label_client_phone: "Customer Phone",
      call: "Call Now",
      label_client_email: "Customer Email",
      send_email: "Send Email",

      // Profile Page
      username: "Username",
      role: "User Role",
      email: "Email Address",
      phone: "Phone Number",
      org_name: "Organization Name",
      address: "Registration Address",
      save_changes: "Save Changes",
      profile_updated: "Profile updated successfully!",

      // Profile
      profile: "Profile"
    }
  },
  ru: {
    translation: {
      map: "Карта",
      orders: "Заказы",
      logout: "Выход",
      details: "Детали",
      found: "Найдено",
      total: "всего",
      
      create_title: "Создать новый рейс",
      btn_publish: "Опубликовать тендер",
      active_shipments: "Активные рейсы",
      placeholder_cargo: "Название груза (напр. Запчасти)",
      placeholder_from: "Откуда (Город)",
      placeholder_to: "Куда (Город)",
      placeholder_desc: "Дополнительное описание...",
      placeholder_vehicle: "Тип транспорта (напр. Тент 20т)",
      search_city: "Поиск города...",
      all_statuses: "Все статусы",
      confirm_delete: "Вы уверены, что хотите удалить этот заказ?",

      label_cargo: "Груз",
      label_weight: "Вес (кг)",
      label_weight_short: "кг",
      label_volume: "Объем (m³)",
      label_vehicle: "Тип ТС",
      label_distance: "Дистанция",
      label_price: "Бюджет",
      label_description: "Комментарий",
      label_published: "Опубликовано",
      label_route: "Маршрут",
      label_params: "Параметры",
      label_status: "Статус",
      label_actions: "Действия",

      unit_currency: "€",
      unit_kg: "кг",
      unit_m3: "м³",
      unit_km: "км",
      unit_km_straight: "км по прямой",
      vehicle_any: "Любой транспорт",
      no_description: "Особых указаний нет.",
      date_n_a: "не указано",
      nothing_found: "Ничего не найдено",
      no_orders: "Заказов пока нет",

      status_pending: "Ожидает",
      status_in_transit: "В пути",
      status_delivered: "Доставлено",

      btn_accept: "Взять этот рейс",
      btn_close: "Закрыть",
      order_accepted_title: "Заказ принят!",
      order_accepted_desc: "Свяжитесь с заказчиком для уточнения деталей",
      label_client_phone: "Телефон заказчика",
      call: "Позвонить",
      label_client_email: "Email заказчика",
      send_email: "Написать письмо",

      // Страница профиля
      username: "Логин",
      role: "Роль пользователя",
      email: "Электронная почта",
      phone: "Номер телефона",
      org_name: "Название организации",
      address: "Юридический адрес",
      save_changes: "Сохранить изменения",
      profile_updated: "Профиль успешно обновлен!",

      // Profile
      profile: "Профиль"
    }
  },
  ukr: {
    translation: {
      map: "Карта",
      orders: "Замовлення",
      logout: "Вихід",
      details: "Деталі",
      found: "Знайдено",
      total: "всього",
      
      create_title: "Створити новий рейс",
      btn_publish: "Опублікувати тендер",
      active_shipments: "Активні рейси",
      placeholder_cargo: "Назва вантажу (напр. Запчастини)",
      placeholder_from: "Звідки (Місто)",
      placeholder_to: "Куди (Місто)",
      placeholder_desc: "Додатковий опис...",
      placeholder_vehicle: "Тип транспорту (напр. Тент 20т)",
      search_city: "Пошук міста...",
      all_statuses: "Усі статуси",
      confirm_delete: "Ви впевнені, що хочете видалити це замовлення?",

      label_cargo: "Вантаж",
      label_weight: "Вага (кг)",
      label_weight_short: "кг",
      label_volume: "Об'єм (m³)",
      label_vehicle: "Тип ТЗ",
      label_distance: "Відстань",
      label_price: "Бюджет",
      label_description: "Коментар",
      label_published: "Опубліковано",
      label_route: "Маршрут",
      label_params: "Параметри",
      label_status: "Статус",
      label_actions: "Дії",

      unit_currency: "€",
      unit_kg: "кг",
      unit_m3: "м³",
      unit_km: "км",
      unit_km_straight: "км по прямій",
      vehicle_any: "Будь-який транспорт",
      no_description: "Особливих вказівок немає.",
      date_n_a: "не вказано",
      nothing_found: "Нічого не знайдено",
      no_orders: "Замовлень поки немає",

      status_pending: "Очікує",
      status_in_transit: "У дорозі",
      status_delivered: "Доставлено",

      btn_accept: "Взяти цей рейс",
      btn_close: "Закрити",
      order_accepted_title: "Замовлення прийнято!",
      order_accepted_desc: "Звяжіться з замовником для уточнення деталей",
      label_client_phone: "Телефон замовника",
      call: "Подзвонити",
      label_client_email: "Email замовника",
      send_email: "Написати листа",

      // Страница профиля
      username: "Логін",
      role: "Роль користувача",
      email: "Электронна адреса",
      phone: "Номер телефону",
      org_name: "Найменування організації",
      address: "Юридична адреса",
      save_changes: "Зберегти зміни",
      profile_updated: "Профіль успішно обновлено!",


      // Profile
      profile: "Профіль"
    }
  },
  it: {
    translation: {
      map: "Mappa",
      orders: "Ordini",
      logout: "Esci",
      details: "Dettagli",
      found: "Trovati",
      total: "totale",
      
      create_title: "Pubblica nuovo carico",
      btn_publish: "Pubblica Gara",
      active_shipments: "Spedizioni attive",
      placeholder_cargo: "Nome merce (es. Ricambi)",
      placeholder_from: "Da (Città)",
      placeholder_to: "A (Città)",
      placeholder_desc: "Descrizione aggiuntiva...",
      placeholder_vehicle: "Tipo di veicolo (es. Centinato 20t)",
      search_city: "Cerca città...",
      all_statuses: "Tutti gli stati",
      confirm_delete: "Sei sicuro di voler eliminare questo ordine?",

      label_cargo: "Merce",
      label_weight: "Peso (kg)",
      label_weight_short: "kg",
      label_volume: "Volume (m³)",
      label_vehicle: "Tipo Veicolo",
      label_distance: "Distanza",
      label_price: "Budget",
      label_description: "Commenti",
      label_published: "Pubblicato",
      label_route: "Percorso",
      label_params: "Parametri",
      label_status: "Stato",
      label_actions: "Azioni",

      unit_currency: "€",
      unit_kg: "kg",
      unit_m3: "m³",
      unit_km: "km",
      unit_km_straight: "km in linea retta",
      vehicle_any: "Qualsiasi veicolo",
      no_description: "Nessun requisito aggiuntivo.",
      date_n_a: "non specificato",
      nothing_found: "Nessun risultato",
      no_orders: "Ancora nessun ordine",

      status_pending: "In attesa",
      status_in_transit: "In transito",
      status_delivered: "Consegnato",

      btn_accept: "Accetta carico",
      btn_close: "Chiudi",
      order_accepted_title: "Ordine aprovato!",
      order_accepted_desc: "Chiama il cliente per chiarire detagli",
      label_client_phone: "Numero cliente",
      call: "Chiama",
      label_client_email: "Email del cliente",
      send_email: "Invia Email",

      username: "Nome utente",
      role: "User role",
      email: "Indirizzo e-mail",
      phone: "Numero di telefono",
      org_name: "Nome del azienda",
      address: "Indirizzo",
      save_changes: "Salva modifiche",
      profile_updated: "Profilo aggiornato con successo!",

      // Profile
      profile: "Profile"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
