"SELECT VALUE count(1) FROM building0minute as c"
"SELECT c.id FROM building0minute as c order by c.id asc"

"SELECT udf.getUTCHours(c.id)+1, c.id FROM building0minute as c order by c.id asc"
// UDF User Defined Functions
function getUTCHours(dateString){
    return new Date(dateString).getUTCHours();
}