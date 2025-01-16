import { bStyles } from "@/styles/buttonStyles";
import { tStyles } from "@/styles/tagStyles.jsx";


const useCombinedStyles = () => {
	const { styles: buttonStyles } = bStyles();
	const { styles: tagStyles } = tStyles();
	
	return {
		buttonStyles,
		tagStyles,
	};
};

export default useCombinedStyles;