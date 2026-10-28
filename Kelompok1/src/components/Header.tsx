import { useEffect, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const NAVY = '#142F70';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 280);

type HeaderRole = 'admin' | 'user';

type HeaderProps = {
  role?: HeaderRole;
  hideLogout?: boolean;
};

const adminMenuItems = [
  { title: 'Dashboard', icon: 'grid-outline', key: 'dashboard', path: '/admin' },
  { title: 'Pemasukan', icon: 'trending-up-outline', key: 'pemasukan', path: '/admin/tambah_pemasukan' },
  { title: 'Pengeluaran', icon: 'trending-down-outline', key: 'pengeluaran', path: '/admin/read_pengeluaran' },
  { title: 'Kelola Transaksi', icon: 'receipt-outline', key: 'transaksi', path: '/admin/daftar_transaksi' },
  { title: 'Laporan Keuangan', icon: 'document-text-outline', key: 'laporan', path: '/admin/laporan_keuangan' },
  { title: 'Deteksi Anomali', icon: 'alert-circle-outline', key: 'anomali', path: '/admin/deteksi-anomali' },
  { title: 'Profil', icon: 'person-outline', key: 'profile', path: '/admin/profil' },
] as const;

const userMenuItems = [
  { title: 'Dashboard', icon: 'grid-outline', key: 'dashboard', path: '/user/dashboard' },
  { title: 'Kelola Transaksi', icon: 'receipt-outline', key: 'transaksi', path: '/user/daftar_transaksi' },
  { title: 'Laporan Keuangan', icon: 'document-text-outline', key: 'laporan', path: '/user/laporan_keuangan' },
  { title: 'Profil', icon: 'person-outline', key: 'profile', path: '/user/profil' },
] as const;

export default function Header({ role, hideLogout = false }: HeaderProps) {
  const pathname = usePathname();
  const inferredRole: HeaderRole = role ?? (pathname.startsWith('/user') ? 'user' : 'admin');
  const menuItems = inferredRole === 'admin' ? adminMenuItems : userMenuItems;
  const activeMenu = getActiveMenu(pathname, inferredRole);

  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);
  const handleMenuPress = (path: string) => {
    closeMenu();
    router.push(path as never);
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={menuOpen ? 'Tutup menu' : 'Buka menu'}
          style={styles.menuButton}
          onPress={() => setMenuOpen((prev) => !prev)}
        >
          <Animated.View
            style={[
              styles.customIconContainer,
              { transform: [{ rotate: iconRotation }] },
            ]}
          >
            <View style={styles.iconBarLong} />
            <View style={styles.iconBarMedium} />
            <View style={styles.iconBarShort} />
          </Animated.View>
        </Pressable>

        <View style={styles.brand}>
          <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />
          <Text style={styles.brandText}>KasOrmawa</Text>
        </View>
      </View>

      {menuOpen ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup menu"
          style={styles.backdrop}
          onPress={closeMenu}
        />
      ) : null}

      <Animated.View
        pointerEvents={menuOpen ? 'auto' : 'none'}
        style={[
          styles.sidebar,
          {
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = activeMenu === item.title;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                onPress={() => handleMenuPress(item.path)}
                style={({ pressed }) => [
                  styles.menuItem,
                  isActive && styles.activeMenuItem,
                  pressed && styles.pressedMenuItem,
                ]}
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

function getActiveMenu(pathname: string, role: HeaderRole) {
  if (role === 'user') {
    if (pathname.startsWith('/user/dashboard')) return 'Dashboard';
    if (
      pathname.startsWith('/user/daftar_transaksi') ||
      pathname.startsWith('/user/detail_transaksi')
    ) return 'Kelola Transaksi';
    if (pathname.startsWith('/user/laporan_keuangan')) return 'Laporan Keuangan';
    if (pathname.startsWith('/user/profil')) return 'Profil';
    return '';
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/admin/tambah_pemasukan')) return 'Pemasukan';
  if (pathname.startsWith('/admin/read_pengeluaran')) return 'Pengeluaran';
  if (
    pathname.startsWith('/admin/daftar_transaksi') ||
    pathname.startsWith('/admin/detail_transaksi')
  ) return 'Kelola Transaksi';
  if (pathname.startsWith('/admin/laporan_keuangan')) return 'Laporan Keuangan';
  if (pathname.startsWith('/admin/deteksi-anomali')) return 'Deteksi Anomali';
  if (pathname.startsWith('/admin/profil')) return 'Profil';
  return '';
}

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
    justifyContent: 'flex-start',
    zIndex: 999,
    elevation: 999,
  },
  menuButton: {
    width: 42,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
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
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#9baacc',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  backdrop: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
    zIndex: 90,
  },
  sidebar: {
    position: 'absolute',
    top: 62,
    left: 0,
    bottom: 0,
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
