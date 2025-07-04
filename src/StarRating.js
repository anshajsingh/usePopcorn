import { useState } from "react";

export default function StarRating({ userRating = 6, color = "#ffc107", fontSize = "2rem", onRatingChange }) {
    const maxRating = 10;
    const [hovered, setHovered] = useState(0);

    const starStyle = {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        fontSize: fontSize,
        color: color,
        background: "#222",
        padding: "12px 24px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };

    return (
        <div style={starStyle}>
            <div>
                {[...Array(maxRating)].map((_, i) => (
                    <span
                        key={i}
                        style={{
                            cursor: "pointer",
                            color:
                                (hovered ? i < hovered : i < userRating)
                                    ? "#ffc107"
                                    : "#444",
                        }}
                        onMouseEnter={() => setHovered(i + 1)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onRatingChange && onRatingChange(i + 1)}
                    >
                        &#9733;
                    </span>
                ))}
            </div>
            <p>{hovered ? hovered : userRating ? userRating : maxRating}</p>
        </div>
    );
}
