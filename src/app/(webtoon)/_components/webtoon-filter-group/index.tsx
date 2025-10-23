import { FilterType } from './constants';
import { WebtoonFilter } from './webtoon-filter';

export function WebtoonFilterGroup() {
  return (
    <ul className="flex items-center justify-center gap-4">
      {Object.values(FilterType).map((type: FilterType) => (
        <li key={type}>
          <WebtoonFilter type={type} />
        </li>
      ))}
    </ul>
  );
}
