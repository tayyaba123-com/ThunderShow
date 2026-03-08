import React from 'react';
import { getImageUrl } from '../api';

export const CastSection = ({ cast = [] }) => {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold mb-6">Top Cast</h3>
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {cast?.slice(0, 10).map((person) => (
          <div key={person.id} className="shrink-0 w-24 text-center">
            <img
              src={getImageUrl(person.profile_path, 'w185')}
              alt={person.name}
              className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-white/10"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs font-bold line-clamp-1">{person.name}</p>
            <p className="text-[10px] text-gray-500 line-clamp-1">{person.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
