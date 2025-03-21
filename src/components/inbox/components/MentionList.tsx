
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface MentionListProps {
  items: { label: string; value: string }[];
  command: (props: { id: string }) => void;
}

const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.value });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (props.items.length === 0) {
    return null;
  }

  return (
    <div className="mentions-menu">
      <ul className="bg-white shadow-md rounded border border-gray-200 py-1 max-h-60 overflow-y-auto">
        {props.items.map((item, index) => (
          <li
            key={index}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${index === selectedIndex ? 'bg-gray-100' : ''}`}
            onClick={() => selectItem(index)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
