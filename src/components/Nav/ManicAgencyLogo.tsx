// src/components/Nav/ManicAgencyLogo.tsx
'use client';

const ManicAgencyLogo = () => {
    return (
        <svg
            width="200"
            height="40"
            viewBox="0 0 200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="manic-logo-svg"
        >
            {/* Mobile version text - shows by default, hidden above 1000px */}
            <text
                x="10"
                y="25"
                className="logo-text-mobile"
                style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fill: 'currentColor'
                }}
            >
                MANIC
            </text>
            
            {/* Desktop version text - hidden by default, shown above 1000px */}
            <text
                x="10"
                y="25"
                className="logo-text-desktop"
                style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fill: 'currentColor'
                }}
            >
                MANIC AGENCY
            </text>
        </svg>
    );
};

export default ManicAgencyLogo;