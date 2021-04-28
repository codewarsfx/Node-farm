
const fs = require('fs')


const data= fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,"utf-8",(error)=>{
    if(error) console.log('an error occured while reading file ');
})

const toursData =JSON.parse(data)


//ROUTE HANDLERS 
exports.getTours=(req,res)=>{
    res.status(200).json({
        "status":"success",
        "results":toursData.length,
        "data":toursData
    })
}

exports.createTour =(req,res)=>{
    const newTourId= (toursData.length-1) + 1
    
    const newTour = Object.assign({id:newTourId},req.body)
    
    const newTours = [...toursData,newTour]

   fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(newTours),(error)=>{
       if(error) console.error('an error occured when trying to write file to system');
       
       res.status(201).json({
           "status":"success",
           "data": newTour
       })
   })    
}

exports.getTour =(req, res)=>{
    
    const tour = toursData.find(item=>item.id === +(req.params.id)) 

    if(!tour) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(200).json({
        "status": "success",
        "data": tour
    })
    
}

exports.updateTour =(req,res)=>{
    
    if(+(req.params.id) > toursData.length) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(200).json({
        "status": "success",
        "data": "successfully updated"
    })
    
    
}

exports.deleteTour=(req,res)=>{
    
    if(+(req.params.id) > toursData.length) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(204).json({
        "status": "success",
        "data": "no content"
    })
    
    
}