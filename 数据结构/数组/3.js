let nums=[2,7,11,15]

const obj = {}
for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i]
    if (obj[diff]!==undifined) {
      return [obj[diff],i]
    }else{
         obj[nums[i]]=i
    }
}

  
