export const authController =(req,res)=>{
    const {username,password}=req.body
 
if(username==="client"&&password==="client@123")
    return res.json({status:"client"})
else if(username==="support"&&password==="support@123"){
    return res.json({status:"support"})
}
else{
   return res.json({status:"fail"})
}

}