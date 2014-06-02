function SpaceRemove(str){
	while(str.indexOf(' ') != -1){
		str = str.replace(' ', '');
	}
	return str;
}

function Reduce(str, length){
	return str.length <= length ? str : str.substring(0, length - 1) + "...";
}