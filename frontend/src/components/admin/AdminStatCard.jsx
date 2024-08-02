import { FaAngleUp, FaAngleDown } from "react-icons/fa";

const StatCard = ({ title, value, change }) => (
    <div className="stat-card">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <span className={`stat-change ${change.className}`}>
            {change.className === 'positive' ? <FaAngleUp /> :
                (change.className === 'negative' ? <FaAngleDown /> : null)}
            {change.change}
        </span>
    </div>
);

export default StatCard;