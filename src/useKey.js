import { useEffect } from "react";

export function useKey(key, action) {
    	useEffect(function () {
		function Callback (e) {
			if (e.key === key) {
					action();
				}
		}
		document.addEventListener("keydown", Callback);
		return function () {
			document.removeEventListener("keydown", Callback);
		};
	}, [action, key]);
    return null;
}