import { useEffect, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const NAVY = '#142F70';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.5, 250);

const menuItems = [
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const [slideAnim] = useState(() => new Animated.Value(-SIDEBAR_WIDTH));
  const [iconRotateAnim] = useState(() => new Animated.Value(0));

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

  const handleDashboard = () => {
    setActiveMenu('Dashboard');
    closeMenu();
    router.push('/admin');
  };
  const handlePemasukan = () => {
    setActiveMenu('Pemasukan');
    closeMenu();
    router.push('/admin/tambah_pemasukan');
  };

  const handlePengeluaran = () => {
    setActiveMenu('Pengeluaran');
    closeMenu();
    router.push('/admin/read_pengeluaran');
  };

  const handleTransaksi = () => {
    setActiveMenu('Kelola Transaksi');
    closeMenu();
    router.push('/admin/daftar_transaksi');
  };

  const handleLaporan = () => {
    setActiveMenu('Laporan Keuangan');
    closeMenu();
    router.push('/admin/laporan_keuangan');
  };

  const handleAnomali = () => {
    setActiveMenu('Deteksi Anomali');
    closeMenu();
    router.push('/admin/deteksi-anomali');
  };

  const handleProfile = () => {
    setActiveMenu('Profile');
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

        {/* BRAND KASINO */}
        <View style={styles.brand}>
          <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />

          <Text style={styles.brandText}>KASINO</Text>
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
          {menuItems.map((item) => {
            const isActive = activeMenu === item.title;

            return (
              <Pressable key={item.key} onPress={() => handleMenuPress(item.key)} style={({ pressed }) => [styles.menuItem, isActive && styles.activeMenuItem, pressed && styles.pressedMenuItem]}>
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

const styles = StyleSheet.create({
  /* =========================
     HEADER
  ========================= */

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
