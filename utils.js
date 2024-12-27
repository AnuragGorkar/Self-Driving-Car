function lerp(start, end, perc){ 
    return start + (end-start)*perc;
}

function getIntersection(A, B, C, D){ 
    const numT = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const numU = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const den = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    if(den!=0){ 
        const t = numT/den; 
        const u = numU/den; 
        if((t>=0 && t<=1) && (u>=0 && u<=1)){
            return {
                x:lerp(A.x, B.x, t), 
                y:lerp(A.y, B.y, t), 
                offSet: t
            }
        }
    }
    return null;    
}

function polyIntersect(poly1, poly2){ 
    for(let i=0; i<poly1.length; i++){ 
        for(let j=0; j<poly2.length; j++){ 
            const touch = getIntersection(poly1[i], poly1[(i+1)%poly1.length], poly2[j], poly2[(j+1)%poly2.length])
            if(touch)
                return true;
        }
    }
    return false;
}