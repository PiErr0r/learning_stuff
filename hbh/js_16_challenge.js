
// Stolen by Richohealey

function Check(checksum)
{
	var tab = "                   azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789_$&#@";
	var entry = document.forms["asdf"].elements[0].value;
	var n = entry.length;
	var sum = 1;
	for(var i=0;i<n;i++)
	{
		var index = tab.indexOf(entry.substring(i,i+1));
		// sum = sum + n * index ** 2 * i ** 3
		sum = sum+(index*n*i)*(index*i*i);
	}
	if(sum==checksum) // checksum = 88692589
	{
		window.location = "check.php?password="+entry;
	}
	else
	{
		alert("Wrong Pass!! Try Again.");
	}	
	return false;
}

