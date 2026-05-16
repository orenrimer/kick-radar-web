import React, { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({
    options,
    selectedOption,
    setSelectedOption,
    onSelect,
    placeholder = "Select an option",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (option) => {
        if (!disabled) {
            setSelectedOption(option);
            onSelect(option); // Trigger the callback with the selected option
            setIsOpen(false);
        }
    };

    return (
        <div className={`dropdown ${disabled ? "dropdown-disabled" : ""}`}>
            <div
                className={`dropdown-header ${disabled ? "disabled" : ""}`}
                onClick={handleToggle}
            >
                {selectedOption || placeholder}
                <span className={`dropdown-icon  ${disabled ? "disabled" : ""} ${isOpen ? "open" : ""}`}>&#9660;</span>
            </div>
            {isOpen && !disabled && (
                <ul className="dropdown-list">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;









// import React, { useState } from "react";
// import "./Dropdown.css"; // CSS for styling the dropdown

// const Dropdown = ({ options, onSelect, placeholder = "Select an option", disabled = false }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedOption, setSelectedOption] = useState(null);

//     const handleToggle = () => {
//         if (!disabled) {
//             setIsOpen(!isOpen);
//         }
//     };

//     const handleSelect = (option) => {
//         if (!disabled) {
//             setSelectedOption(option);
//             onSelect(option); // Trigger the callback with the selected option
//             setIsOpen(false);
//         }
//     };

//     const resetDropdown = () => {
//         setSelectedOption(null); // Reset the selected option
//         onSelect(null); // Inform the parent that selection has been reset
//     };

//     return (
//         <div className={`dropdown ${disabled ? "dropdown-disabled" : ""}`}>
//             <div
//                 className={`dropdown-header ${disabled ? "disabled" : ""}`}
//                 onClick={handleToggle}
//             >
//                 {selectedOption || placeholder}
//                 <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>&#9660;</span>
//             </div>
//             {isOpen && !disabled && (
//                 <ul className="dropdown-list">
//                     {options.map((option, index) => (
//                         <li
//                             key={index}
//                             className="dropdown-item"
//                             onClick={() => handleSelect(option)}
//                         >
//                             {option}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Dropdown;
