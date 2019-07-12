

const height = 20;

const elems = height*(height+1)/2;

var pyramid = [  ];

var pyramid2 = [  ];
var filled = 0;

function init(pyr) {
    pyr =  [ ];
    for (i = 0; i < elems; i++) {
            pyr.push(NaN);
    }


}

function print(pyr) {
    let k = 0;
    for (i = 0; i < height; i++) {
        for (j = 0; j < i+1; j++) {
            let v = pyr[k++];

            process.stdout.write((isNaN(v)? "*":v) + "\t" );
        }
        process.stdout.write("\n");
    }
}

function is_empty(pyr) {
    for (i = 0; i < elems; i++) {
        if (!isNaN(pyr[i]))
            return false;
    }

    return true;
}

function copy_pyramid(pyr_src, pyr_dst) {
    for (i = 0; i < elems; i++) {
        pyr_dst[i] = pyr_src[i];
    }
}

function is_full(pyr) {
    for (i = 0; i < elems; i++) {
        if (isNaN(pyr[i]))
            return false;
    }

    return true;
}

function is_neg(pyr) {
    for (i = 0; i < elems; i++) {
        if (pyr[i] < 0)
            return true;
    }

    return false;
}


function remove_one(pyr) {

    if (is_empty(pyr))
        return -1;

    let p = 0;
    do {
        p = Math.floor(Math.random()*elems);

    } while (isNaN(pyr[p]));

    let pos = get_pos(p);

    let val = pyr[p];

    pyr[p] = NaN;

    return { pos: p, val: val} ;
}


function add_one(pyr) {

    if (is_full(pyr))
        return -1;

    let p = 0;
    do {
        p = Math.floor(Math.random()*elems);

    } while (!isNaN(pyr[p]));

    let pos = get_pos(p);

    let val = Math.floor(Math.random()*(height-pos.row)*5 );

    pyr[p] = val;

    return 0;
}

function get_pos(idx) {

    let row = 0;
    let col = 0;

    let x = Math.floor(Math.sqrt(2*idx));

    let b = (x+1)*(x+1) + x - 1;
    let a = (x+1)*(x+1) - x - 1;

    if ( (2*idx >= a) && (2*idx <= b) )
        row = x;
    else
        row = x-1;

    col = idx - row*(row+1)/2;
    
    return { row: row, col: col };

}

function get_idx(pos) {
    return pos.row*(pos.row+1)/2 + pos.col;
}

function solve_basic(pyr, idx) {
    let pos = get_pos(idx);

    if (pos.row >= (height - 1))
        return 0;

    let top_idx = idx;
    let top = pyr[idx];
    pos.row++;
    let left_idx = get_idx(pos);
    let left = pyr[left_idx];
    pos.col++;
    let right_idx = get_idx(pos);
    let right = pyr[right_idx];

    if (isNaN(top)) {
        if (isNaN(left) || isNaN(right))
            return -1;
        else {
            top = left + right;
            pyr[top_idx] = top;
            return 1;
        }
    } else {
        
        if (isNaN(left) && isNaN(right)) 
            return -1;

        if (isNaN(left)) {
            left = top - right;
            pyr[left_idx] = left;
            return 1;
        }
        if (isNaN(right)) {
            right = top - left;
            pyr[right_idx] = right;
            return 1;
        }
    }
    return 0;

}

function solve(pyr) {
    let finished = true;
    let i = 0;
    while (i < (elems-height)) {
        let res = solve_basic(pyr, i);

        // if something was inserted
        if  (res == 1) {
            i = 0;
            finished = true;
        }
        else if (res == -1) {  // Cannot do anything
            finished = false;
            i++;
        }
        else {
            i++;
        }

    }
    return finished;
}


//while (true) {
    init(pyramid);
    init(pyramid2);

    // Just initialize last row
    for (i = (elems-height); i < elems; i++) {
        let val = Math.floor(Math.random()*5 );
        pyramid[i] = val;
    }

    print(pyramid);

    solve(pyramid);

    let s = true;

    do {
        let x = remove_one(pyramid);
        copy_pyramid(pyramid, pyramid2);

        s = solve(pyramid2);
        if (!s) {
            pyramid[x.pos] = x.val;
            break;
        }

    } while (s);

    print(pyramid);

    let solvable = solve(pyramid);
    if (solvable)
        console.log("Solvable");
//}

