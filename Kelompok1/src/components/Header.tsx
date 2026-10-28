import { useEffect, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const NAVY = '#142F70';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.5, 250);

/* =========================
   MENU ADMIN
========================= */

const adminMenuItems = [
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    key: 'dashboard',
  },
  {
    title: 'Pemasukan',
    icon: 'trending-up-outline',
    key: 'pemasukan',
  },
  {
    title: 'Pengeluaran',
    icon: 'trending-down-outline',
    key: 'pengeluaran',
  },
  {
    title: 'Kelola Transaksi',
    icon: 'receipt-outline',
    key: 'transaksi',
  },
  {
    title: 'Laporan Keuangan',
    icon: 'document-text-outline',
    key: 'laporan',
  },
  {
    title: 'Deteksi Anomali',
    icon: 'alert-circle-outline',
    key: 'anomali',
  },
  {
    title: 'Profile',
    icon: 'person-outline',
    key: 'profile',
  },
] as const;

/* =========================
   MENU USER
========================= */

const userMenuItems = [
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    key: 'dashboard',
  },
  {
    title: 'Riwayat Transaksi',
    icon: 'receipt-outline',
    key: 'riwayat',
  },
  {
    title: 'Laporan Keuangan',
    icon: 'document-text-outline',
    key: 'laporan',
  },
  {
    title: 'Profile',
    icon: 'person-outline',
    key: 'profile',
  },
] as const;

/* =========================
   PROPS
========================= */

type HeaderProps = {
  role?: 'admin' | 'user';
};

export default function Header({ role = 'admin' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const activeMenu = getActiveMenu(pathname);

  const [slideAnim] = useState(() => new Animated.Value(-SIDEBAR_WIDTH));

  const [iconRotateAnim] = useState(() => new Animated.Value(0));

  const currentMenuItems = role === 'user' ? userMenuItems : adminMenuItems;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: menuOpen ? 0 : -SIDEBAR_WIDTH,
        duration: menuOpen ? 250 : 200,
        useNativeDriver: true,
      }),

      Animated.timing(iconRotateAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpen, slideAnim, iconRotateAnim]);

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================
     NAVIGASI ADMIN
  ========================= */

  const handleDashboard = () => {
    closeMenu();
    router.push('/admin');
  };

  const handlePemasukan = () => {
    closeMenu();
    router.push('/admin/tambah_pemasukan');
  };

  const handlePengeluaran = () => {
    closeMenu();
    router.push('/admin/read_pengeluaran');
  };

  const handleTransaksi = () => {
    closeMenu();
    router.push('/admin/daftar_transaksi');
  };

  const handleLaporan = () => {
    closeMenu();
    router.push('/admin/laporan_keuangan');
  };

  const handleAnomali = () => {
    closeMenu();
    router.push('/admin/deteksi-anomali');
  };

  const handleProfile = () => {
    closeMenu();
    router.push('/admin/profil');
  };

  const handleMenuPress = (key: string) => {
    switch (key) {
      case 'dashboard':
        handleDashboard();
        break;

      case 'pemasukan':
        handlePemasukan();
        break;

      case 'pengeluaran':
        handlePengeluaran();
        break;

      case 'transaksi':
        handleTransaksi();
        break;

      case 'laporan':
        handleLaporan();
        break;

      case 'anomali':
        handleAnomali();
        break;

      case 'profile':
        handleProfile();
        break;
    }
  };

  /* =========================
     NAVIGASI USER
  ========================= */

  const handleUserDashboard = () => {
    closeMenu();
    router.push('/user/dashboard');
  };

  const handleUserRiwayat = () => {
    closeMenu();
    router.push('/user/daftar_transaksi');
  };

  const handleUserLaporan = () => {
    closeMenu();
    router.push('/user/laporan_keuangan');
  };

  const handleUserProfile = () => {
    closeMenu();
    router.push('/user/profil');
  };

  const handleUserMenuPress = (key: string) => {
    switch (key) {
      case 'dashboard':
        handleUserDashboard();
        break;

      case 'riwayat':
        handleUserRiwayat();
        break;

      case 'laporan':
        handleUserLaporan();
        break;

      case 'profile':
        handleUserProfile();
        break;
    }
  };

  return (
    <>
      {/* HEADER */}

      <View style={styles.header}>
        {/* TOMBOL DRAWER */}

        <Pressable style={styles.menuButton} onPress={toggleMenu}>
          <Animated.View
            style={[
              styles.customIconContainer,
              {
                transform: [
                  {
                    rotate: iconRotation,
                  },
                ],
              },
            ]}
          >
            <View style={styles.iconBarLong} />
            <View style={styles.iconBarMedium} />
            <View style={styles.iconBarShort} />
          </Animated.View>
        </Pressable>

        {/* BRAND KASORMAWA */}

        <View style={styles.brand}>
          <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />

          <Text style={styles.brandText}>KasOrmawa</Text>
        </View>
      </View>

      {/* DRAWER */}

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [
              {
                translateX: slideAnim,
              },
            ],
          },
        ]}
      >
        <View style={styles.menuContainer}>
          {currentMenuItems.map((item) => {
            const isActive = activeMenu === item.title;

            return (
              <Pressable
                key={item.key}
                onPress={() => (role === 'user' ? handleUserMenuPress(item.key) : handleMenuPress(item.key))}
                style={({ pressed }) => [styles.menuItem, isActive && styles.activeMenuItem, pressed && styles.pressedMenuItem]}
              >
                <Ionicons name={item.icon} size={22} color="#FFFFFF" />

                <Text style={styles.menuText}>{item.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
}

/* =========================
   MENU AKTIF
========================= */

function getActiveMenu(pathname: string) {
  /* ADMIN */

  if (pathname === '/admin' || pathname === '/admin/dashboard') return 'Dashboard';

  if (pathname.startsWith('/admin/tambah_pemasukan')) return 'Pemasukan';

  if (pathname.startsWith('/admin/read_pengeluaran')) return 'Pengeluaran';

  if (pathname.startsWith('/admin/daftar_transaksi') || pathname.startsWith('/admin/detail_transaksi')) return 'Kelola Transaksi';

  if (pathname.startsWith('/admin/laporan_keuangan')) return 'Laporan Keuangan';

  if (pathname.startsWith('/admin/deteksi-anomali')) return 'Deteksi Anomali';

  if (pathname.startsWith('/admin/profil')) return 'Profile';

  /* USER */

  if (pathname === '/user' || pathname === '/user/dashboard') return 'Dashboard';

  if (pathname.startsWith('/user/daftar_transaksi') || pathname.startsWith('/user/detail_transaksi')) return 'Riwayat Transaksi';

  if (pathname.startsWith('/user/laporan_keuangan')) return 'Laporan Keuangan';

  if (pathname.startsWith('/user/profil')) return 'Profile';

  return '';
}

/* =========================
   STYLE
========================= */

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    height: 62,

    backgroundColor: NAVY,

    paddingHorizontal: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    zIndex: 999,
    elevation: 999,
  },

  menuButton: {
    width: 42,
    height: 42,

    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  /* =========================
     CUSTOM MENU ICON
  ========================= */

  customIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,

    width: 28,
    height: 28,

    justifyContent: 'center',
  },

  iconBarLong: {
    width: 3.5,
    height: 22,

    backgroundColor: '#FFFFFF',

    borderRadius: 2,
  },

  iconBarMedium: {
    width: 3.5,
    height: 15,

    backgroundColor: '#FFFFFF',

    borderRadius: 2,
  },

  iconBarShort: {
    width: 3.5,
    height: 9,

    backgroundColor: '#FFFFFF',

    borderRadius: 2,
  },

  /* =========================
     BRAND
  ========================= */

  brand: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  brandText: {
    color: '#FFFFFF',

    fontSize: 20,
    fontWeight: '700',

    letterSpacing: 0.5,
  },

  /* =========================
     DRAWER
  ========================= */

  sidebar: {
    position: 'absolute',

    top: 62,
    left: 0,
    bottom: 0,

    width: SIDEBAR_WIDTH,

    backgroundColor: NAVY,

    paddingTop: 15,
    paddingBottom: 20,

    zIndex: 100,
    elevation: 100,
  },

  menuContainer: {
    width: '100%',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 14,

    paddingVertical: 15,
    paddingHorizontal: 22,

    marginHorizontal: 8,

    borderRadius: 8,
  },

  activeMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  pressedMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  menuText: {
    flexShrink: 1,

    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: '500',
  },
});
