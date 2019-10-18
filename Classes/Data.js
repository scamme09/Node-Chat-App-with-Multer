class Data {
    constructor(query, table, cols, where){
        this.query = query;
        this.table = table;
        this.cols = cols;
        this.where = where;
        this.sql = function(){
            let sql = "";
            switch (this.query) {
                case "Select":
                    sql = this.select();
                    break;
                case "Insert":
                    sql = this.insert();
                    break;
                case "Update":
                    sql = this.update();
                    break;
                case "Delete":
                    sql = this.delete();
                    break;
                default:
                    break;
            }
            return sql;
        }
    }

    build() {
        let query = "";
        if(Array.isArray(this.cols)){
            query = this.cols.join() + " FROM ";
        }else{
            query = this.cols  + " FROM ";
        }

        query += this.table;

        if(this.where){
            query += " WHERE " + this.where;
        }

        return query;
    }

    select() {
        return "SELECT " + this.build();
    }

    insert() {
        return "INSERT " + this.build();
    }

    update() {
        return "UPDATE " + this.build();
    }

    delete() {
        return "DELETE " + this.build();
    }
}
 
module.exports = Data;