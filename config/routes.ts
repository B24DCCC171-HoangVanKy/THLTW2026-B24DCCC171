export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		name: 'Kế hoạch du lịch',
		path: '/ke-hoach-du-lich',
		icon: 'CompassOutlined',
		locale: false,
		routes: [
			{
				name: 'Khám phá điểm đến',
				path: 'kham-pha-diem-den',
				component: './KeHoachDuLich/KhamPhaDiemDen',
				icon: 'EnvironmentOutlined',
				locale: false,
			},
			{
				name: 'Tạo lịch trình',
				path: 'tao-lich-trinh',
				component: './KeHoachDuLich/TaoLichTrinh',
				icon: 'CalendarOutlined',
				locale: false,
			},
			{
				name: 'Quản lý ngân sách',
				path: 'quan-ly-ngan-sach',
				component: './KeHoachDuLich/QuanLyNganSach',
				icon: 'PieChartOutlined',
				locale: false,
			},
			{
				name: 'Admin',
				path: 'admin',
				component: './KeHoachDuLich/Admin',
				icon: 'SettingOutlined',
				locale: false,
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
