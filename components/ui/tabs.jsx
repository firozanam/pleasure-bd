import React, { useState } from 'react';

export function Tabs({ children, defaultValue }) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    
    // Create a context object containing both the active tab and setter
    const tabsContent = React.Children.map(children, child => {
        // Only clone and pass props to valid React elements
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                activeTab,
                onTabChange: setActiveTab
            });
        }
        return child;
    });

    return <div>{tabsContent}</div>;
}

export function TabsList({ children, activeTab, onTabChange }) {
    // Pass down activeTab and onTabChange to TabsTrigger children
    const triggers = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                activeTab,
                onTabChange
            });
        }
        return child;
    });

    return <div className="flex space-x-4">{triggers}</div>;
}

export function TabsTrigger({ value, children, activeTab, onTabChange }) {
    return (
        <button
            className={`px-4 py-2 ${activeTab === value ? 'bg-gray-200' : ''}`}
            onClick={() => onTabChange(value)}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, activeTab }) {
    return activeTab === value ? <div>{children}</div> : null;
}