const MONTHS =['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
/**
 * The Format class will handle formatting dates, large and ordinal  numbers 
 * 
 * for more readable and responsive ui display
 */

class Format {

    createdAt(createdAt){
        const now=new Date();
        const createdAtMillis=new Date(createdAt);
        const timeDiffMillSecs=now-createdAtMillis //milliseconds
      
        const timeDiffMins=Math.round(timeDiffMillSecs/ 60000); //mins

        const timeDiffHrs = Math.round(timeDiffMillSecs / 3600000); //hrs
      
        if(now.getFullYear() === createdAtMillis.getFullYear()){
          // secs
          const secs =Number((timeDiffMins*60).toFixed(0));
          if(secs < 60) return secs+"s";
      
          // mins
          if(timeDiffMins < 60) return timeDiffMins.toFixed(0)+"m";
      
          // hrs
          if(timeDiffMins >= 60 && timeDiffMins<1440) return timeDiffHrs.toFixed(0)+"hr";
      
          // days
          return MONTHS[createdAtMillis.getMonth()] +" "+createdAtMillis.getDate();
        }else{
          return MONTHS[createdAtMillis.getMonth()] +" "+createdAtMillis.getDate()+", "+createdAtMillis.getFullYear();
        }
    };

    points=(points)=>{
        /*
        Goal is to format total points in to 3 characters
        e.g (1100 = 1.1k, 25600 = 25k, 110000 = 110k, 1100000 = 1.1M)
        */
        points= Math.floor(points);
        const formatter =(len,prefix,isOneK=false, decRequired)=>{
            let formattedDigts = points.toString().substr(0,len);
            if(isOneK){
                const newPoints=formattedDigts.split("");
                if(newPoints[1]==="0"){ //Truncate zero if 1000
                    formattedDigts = newPoints[0]
                } else{
                    formattedDigts = `${newPoints[0]}.${newPoints[1]}`
                }
                return formattedDigts + prefix        
            }else{
                if(decRequired){
                    const newformat = formattedDigts.split("");
                    if(decRequired==="oneM"){
                        formattedDigts = `${newformat[0]}.${newformat[1]}${newformat[2]}`
                    }else{
                        formattedDigts = `${newformat[0]}${newformat[1]}.${newformat[2]}`;
                    }
                }
                return formattedDigts + prefix;
            }
        }
    
        // break points
        const onek=1000, tenK=10000,hundK=100000,oneM=1000000, tenM=10000000, hundM=100000000;
    
        if(points>=onek && points<tenK)return formatter(2,"K",true) //1K
        if(points>=tenK && points<hundK)return formatter(3,"K",null,"tenK") // 10k
        if(points>=hundK && points<oneM)return formatter(3,"K") // 100k
        if(points>=oneM && points<tenM)return formatter(3,"M",null,"oneM")  // 1M
        if(points>=tenM && points<hundM)return formatter(3,"M",null,"tenM") // 10M
        if(points>=hundM)return formatter(3,"M")   // 10OM
    
        if(points<10) return points.toFixed(1); //Avoids grammar error with 1 Votes
        return points // 100s
    }

    rank(rank){
        /**
         * Goal is to put user rank number in its appropriate ordinal number form
         * returns a string (st,nd,rd,th)
         */

        let ordString = "";
        if(rank === 0) ordString = "th";
        if(rank === 1) ordString = "st";
        if(rank === 2) ordString = "nd";
        if(rank === 3) ordString = "rd";

        if(rank >=4){
            let ArrayRank = rank.toString().split("");
            let arrLen = ArrayRank.length;
            let lastItem = ArrayRank[arrLen - 1]
            // Get last item from ArrayRank and check if it is any of 1,2 or 3
            if(lastItem === "1") ordString = "st";
            if(lastItem === "2") ordString = "nd";
            if(lastItem === "3") ordString = "rd";

            if(lastItem !=="1" && lastItem !=="2" && lastItem !=="3") ordString = "th";
        }
        let formatRank = this.points(rank) * 1;

        if(formatRank < 10){ //Removes decimal zero
            formatRank = Math.trunc(formatRank)
        }

        return(
            <div>
                {formatRank}
                <sup className="super-script">{ordString}</sup>
            </div>
        )
    }
}

export default Format;