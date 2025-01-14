// Sidebar.tsx
import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="p-4 border border-gray-700 rounded-lg bg-zinc-700">
            
            <h3 className=" mb-2 text-white text-xl">Boards</h3>
            <ul>
                <li>All Feedback (77)</li> 
                <li>Bugs (21)</li>
                <li>Features (36)</li>
                <li>UI/UX (20)</li>
            </ul>
        </div>
    );
};

export default Sidebar;
