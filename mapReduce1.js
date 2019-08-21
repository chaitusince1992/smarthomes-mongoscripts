db.building0.mapReduce(
    function() {
        var date = new Date(this.timestamp * 1000);
        date.setHours(date.getHours()); 
        //var dateKey = (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
        //var dateKey = (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() +", "+ date.getHours()+":"+date.getMinutes());
        var dateKey = (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() +", "+ date.getHours());
        var value = this.a5;
        emit(dateKey, value);
    },
    function(key, values) {
        var sum = 0;
        values.forEach(function(d){
            if(d)
                sum = sum+Number(d);
        })
        return sum;
    },
    { out: "map_red_test" }
)