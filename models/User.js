const db=require("../db");

class User{
     static async findByEmail(email){
          return new Promise((resolve,reject)=>{
               db.query("SELECT * FROM users WHERE email=?",[email],(err,result)=>{
                    if(err){
                         reject(err);
                    }
                    else{
                         resolve(result[0] || null);
                    }
               });
          });
     }
     static async createUser(name, email, password, role) {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
              [name, email, password, role],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
        }
        
}
module.exports=User;
