# Estructura del proyecto creada

Esta estructura fue creada automáticamente para la app del dashboard de Systeam Break:

```
APP-INTEGRATION-SYSTEMBREAK/
├─ public/
│  ├─ images/
│  └─ icons/
├─ src/
│  ├─ app/
│  │  ├─ (dashboard)/
│  │  │  ├─ rooms/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [roomId]/page.tsx
│  │  │  ├─ devices/[deviceId]/page.tsx
│  │  │  ├─ incidents/page.tsx
│  │  │  └─ reports/page.tsx
│  │  ├─ api/  # placeholder api mock
│  │  │  └─ hello/route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ layout/Sidebar.tsx
│  │  ├─ layout/Topbar.tsx
│  │  ├─ layout/DashboardShell.tsx
│  │  ├─ rooms/RoomCard.tsx
│  │  ├─ rooms/RoomGrid.tsx
│  │  ├─ devices/DeviceCard.tsx
│  │  ├─ devices/DeviceList.tsx
│  │  ├─ devices/DeviceStatusBadge.tsx
│  │  ├─ charts/IncidentsChart.tsx
│  │  ├─ charts/VulnerabilitiesChart.tsx
│  │  └─ ui/(Button, Card, Loader)
│  ├─ services/(http, devices, incidents, reports)
│  ├─ hooks/(useRooms, useRoomDevices, useDeviceLatestReport, useIncidents)
│  ├─ lib/(env, format)
│  ├─ types/(room, device, incident, report)
│  └─ config/nav.ts
```

Cada archivo contiene un componente o hook placeholder con implementaciones mínimas, útiles como punto de partida.

Para ejecutar el proyecto (si Next.js y dependencias están instaladas):

```bash
npm install
npm run dev
```

Modifica los servicios y hooks para integrar tu API backend.
