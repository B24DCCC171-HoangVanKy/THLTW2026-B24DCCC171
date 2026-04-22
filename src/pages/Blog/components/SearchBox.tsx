import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/services/Blog/constant';

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, placeholder }) => {
	const [tuKhoa, setTuKhoa] = useState<string>(value);

	useEffect(() => {
		setTuKhoa(value);
	}, [value]);

	const ganDebounce = useMemo(
		() => debounce((val: string) => onChange(val), SEARCH_DEBOUNCE_MS),
		[onChange],
	);

	useEffect(() => {
		return () => {
			ganDebounce.cancel();
		};
	}, [ganDebounce]);

	return (
		<Input
			allowClear
			size='large'
			placeholder={placeholder ?? 'Tìm kiếm bài viết...'}
			prefix={<SearchOutlined />}
			value={tuKhoa}
			onChange={(e) => {
				const giaTri = e.target.value;
				setTuKhoa(giaTri);
				ganDebounce(giaTri);
			}}
		/>
	);
};

export default SearchBox;
