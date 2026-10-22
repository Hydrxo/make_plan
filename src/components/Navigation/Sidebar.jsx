import { useState } from "react";
import "./Sidebar.css";

const navigationItems = [
    { label: "Planner", href: "/planner", icon: "▦" },
    { label: "Semester plan", href: "/progress", icon: "▤" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar${collapsed ? " sidebar-collapsed" : ""}`}>
            <div className="sidebar-brand">
                <span className="sidebar-logo" aria-hidden="true">M</span>
                {!collapsed && <span className="sidebar-brand-name">MakePlan</span>}
            </div>

            <button
                type="button"
                className="sidebar-toggle"
                aria-label={collapsed ? "Expand navigation" : "Minimize navigation"}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed((current) => !current)}
            >
                <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
            </button>

            <nav className="sidebar-navigation" aria-label="Main navigation">
                {!collapsed && <p className="sidebar-section-title">WORKSPACE</p>}
                {navigationItems.map((item) => (
                    <a
                        className="sidebar-link"
                        href={item.href}
                        key={item.href}
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="sidebar-link-icon" aria-hidden="true">
                            {item.icon}
                        </span>
                        {!collapsed && <span>{item.label}</span>}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
