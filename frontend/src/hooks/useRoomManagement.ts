import { useState, useMemo } from 'react';
import { Room, RoomType, RoomStatus } from '../components/admin/AdminDashboard';
import { useRooms } from './useRooms';
import { showConfirm } from '../components/ui/ConfirmDialog';

const ITEMS_PER_PAGE = 5;

export function useRoomManagement() {
  const {
    rooms: rawRooms,
    loading: roomsLoading,
    updateRoomStatus,
    createRoom,
    updateRoom,
    deleteRoom,
  } = useRooms();

  // ── Derived room list ───────────────────────────────────────────────────────
  const rooms: Room[] = useMemo(() => {
    if (!rawRooms || rawRooms.length === 0) return [];
    return rawRooms.map((r) => ({
      id: Number(r.id),
      name: r.name,
      type: (r.type.includes('computer') ? 'computer' :
        r.type.includes('tele-conference') ? 'distance_learning' : 'seminar') as RoomType,
      capacity: r.capacity,
      fee: r.priceHalfDay || 2500,
      status: r.status as RoomStatus,
      isActive: r.available,
      technicalIssue: null,
      floor: String(r.floor),
      equipment: r.amenities,
    }));
  }, [rawRooms]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [roomSearch, setRoomSearch] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<RoomType | 'all'>('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showTechAlert, setShowTechAlert] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // ── Derived/filtered lists ──────────────────────────────────────────────────
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
        r.floor.includes(roomSearch);
      const matchType = roomTypeFilter === 'all' || r.type === roomTypeFilter;
      const matchStatus = roomStatusFilter === 'all' || r.status === roomStatusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [rooms, roomSearch, roomTypeFilter, roomStatusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ITEMS_PER_PAGE));
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  const toggleExpandRow = (id: number) => {
    setExpandedRows(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleRoomStatus = async (id: number) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    const nextStatus = room.isActive ? 'maintenance' : 'available';
    try {
      await updateRoomStatus(id, nextStatus);
    } catch {
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะห้อง');
    }
  };

  const handleSaveRoom = async (roomData: Omit<Room, 'id'>) => {
    let room_type_id = 1;
    if (roomData.type === 'computer') room_type_id = 2;
    else if (roomData.type === 'distance_learning') room_type_id = 3;

    const payload = {
      org_id: 1,
      room_type_id,
      room_name: roomData.name,
      capacity: Number(roomData.capacity),
      floor: Number(roomData.floor),
      room_status: roomData.status,
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
      } else {
        await createRoom(payload);
      }
      setShowRoomModal(false);
      setEditingRoom(null);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูลห้อง: ${err.message || err}`);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    const room = rooms.find(r => r.id === id);
    const confirmed = await showConfirm({
      title: 'ยืนยันการลบห้อง',
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบ "${room?.name ?? 'ห้องนี้'}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
      confirmLabel: 'ลบห้อง',
      cancelLabel: 'ยกเลิก',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await deleteRoom(id);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการลบห้อง: ${err.message || err}`);
    }
  };

  const handleReportMaintenance = async (id: number) => {
    try {
      await updateRoomStatus(id, 'maintenance');
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการแจ้งซ่อมบำรุง: ${err.message || err}`);
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setShowRoomModal(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  return {
    // Data
    rooms,
    roomsLoading,
    filteredRooms,
    paginatedRooms,
    totalPages,
    ITEMS_PER_PAGE,
    // Filter state
    roomSearch,
    setRoomSearch: (v: string) => { setRoomSearch(v); setCurrentPage(1); },
    roomTypeFilter,
    setRoomTypeFilter: (v: RoomType | 'all') => { setRoomTypeFilter(v); setCurrentPage(1); },
    roomStatusFilter,
    setRoomStatusFilter: (v: RoomStatus | 'all') => { setRoomStatusFilter(v); setCurrentPage(1); },
    // Pagination
    currentPage,
    setCurrentPage,
    // Modal state
    showRoomModal,
    editingRoom,
    openAddModal,
    openEditModal,
    closeRoomModal,
    showTechAlert,
    setShowTechAlert,
    // Row expand
    expandedRows,
    toggleExpandRow,
    // Handlers
    toggleRoomStatus,
    handleSaveRoom,
    handleDeleteRoom,
    handleReportMaintenance,
  };
}
