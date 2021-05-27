function save(elements)
{
    console.log(elements);
    savedElements = []
    elements.forEach((item) => {
        console.log(item)
        savedElements.push({
            type: item.elem.getType(),
            data: item.elem.getJSON()
        })
    }) 

    var fileContent = JSON.stringify(savedElements);
    var bb = new Blob([fileContent ], { type: 'text/json' });
    var a = document.createElement('a');
    a.download = 'download.txt';
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

