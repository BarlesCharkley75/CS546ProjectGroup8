let hotelList = $("#hotelsList")

let tmpList = ['One', 'Two', 'Three', 'Four', 'Five']

tmpList.forEach(element => {
    hotelList.append("<li>" + element + "</l1>")
})