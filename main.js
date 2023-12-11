var constraintsCount;
var variablesCount;
var equalCount;

function opposite(number) {
  return(-number);
}


function findBasicVariables(mtx) {
  const m = mtx.length-1;
  const n = mtx[0].length;
  const basicVars = [];

  for (var j = 0; j < n; j++) {
    var col = [];
    for (var i = 0; i < m; i++) {
      col.push(mtx[i][j]);
    }
    if (col.filter((el) => el === 0).length === m - 1 && col.filter((el) => el === 1).length === 1) {
      basicVars[j] = true;
    }
    else basicVars[j] = false;
  }
  console.log("basicVars " + basicVars);
  return basicVars;
}

function findBasicVariablesBasis(mtx) {
  const m = mtx.length;
  const n = mtx[0].length;
  const basicVars = [];

  for (var j = 0; j < n; j++) {
    var col = [];
    for (var i = 0; i < m; i++) {
      col.push(mtx[i][j]);
    }
    if (col.filter((el) => el === 0).length === m - 1 && col.filter((el) => el === 1).length === 1) {
      basicVars[j] = true;
    }
    else basicVars[j] = false;
  }
  console.log("basicVars " + basicVars);
  return basicVars;
}

// Поиск опорного столбца
function findPivotColumnMax(mtx) {

  var min = mtx[constraintsCount][0];
  var pivotColumn = 0;

  // Поиск столбца с наименьшим значением
  for (var j = 1; j < constraintsCount+variablesCount-equalCount; j++) {
    if (mtx[constraintsCount][j] < min) {
      min = mtx[constraintsCount][j];
      pivotColumn = j;
    }
  }

  if (min >= 0) {
    // Нет отрицательных значений в последней строке - оптимальное решение
    return -1;
  }
  console.log("pivotColumn " + pivotColumn);
  return pivotColumn;
}

function findPivotColumnMin(mtx) {
  var max = mtx[constraintsCount][0];
  var pivotColumn = 0;

  // Поиск столбца с наименьшим значением
  for (var j = 1; j < constraintsCount+variablesCount-equalCount; j++) {
    if (mtx[constraintsCount][j] > max) {
      max = mtx[constraintsCount][j];
      pivotColumn = j;
    }
  }

  if (max <= 0) {
    return -1;
  }
console.log("pivotColumn " + pivotColumn);
  return pivotColumn;
}


function findPivotRow(mtx, pivotColumn) {
  var outputDiv = document.getElementById("simplex-container");
  outputDiv.insertAdjacentHTML('beforeend', '<span>Находим симплекс-отношения Q, путём деления коэффициентов b на соответствующие значения столбца ' + (pivotColumn+1) + '.</span><br/>');

  var m = constraintsCount;

  var pivotRow = -1;
  var minRatio = Infinity;

  // Поиск строки с наименьшим отношением
  for (var i = 0; i < constraintsCount; i++) {
    var ratio = mtx[i][variablesCount+constraintsCount-equalCount] / mtx[i][pivotColumn];
    if (ratio > 0) {
      if (ratio < minRatio) {
        minRatio = ratio;
        pivotRow = i;
      }
    }
  }

  if (minRatio === Infinity) {
    // Отношение осталось бесконечным - задача не имеет ограничений
    outputDiv.insertAdjacentHTML('beforeend', '<span>Все значения столбца ' + (pivotColumn+1) + ' неположительны.</span><br/>');
    return -1;
  }

  outputDiv.insertAdjacentHTML('beforeend', '<span>В найденном столбце ищем строку с наименьшим значением Q: Qmin = ' + Math.round(minRatio * 1000) / 1000 + ', строка ' + (pivotRow+1) + '.</span><br/>');
  return pivotRow;
}


function updatePivotRow(mtx, pivotRow, pivotColumn) {
  var pivotValue = mtx[pivotRow][pivotColumn];
  var pivotRowLength = mtx[pivotRow].length;

  var outputDiv = document.getElementById("simplex-container");
  outputDiv.insertAdjacentHTML('beforeend', '<span>Делим строку ' + (pivotRow+1) + ' на ' + (Math.round(pivotValue * 1000) / 1000) + '. </span>');

  // Деление строки на опорный элемент
  for (var j = 0; j < pivotRowLength; j++) {
    mtx[pivotRow][j] /= pivotValue;
  }
}

function updateOtherRows(mtx, pivotRow, pivotColumn) {
  var pivotRowLength = mtx[pivotRow].length;
  var pivotValue = mtx[pivotRow][pivotColumn];
  var rr = mtx.map(d => d[variablesCount+constraintsCount-equalCount]);

  var outputDiv = document.getElementById("simplex-container");
  outputDiv.insertAdjacentHTML('beforeend', '<span>Из остальных строк вычитаем строку ' + (pivotRow+1) + ' умноженную на соответствующий элемент в столбце ' + (pivotColumn+1) + '.</span><br/>');

  for (var i = 0; i <constraintsCount + 1; i++) {
    if (i !== pivotRow) {
      var multiplier = -mtx[i][pivotColumn];
      for (var j = 0; j < pivotRowLength; j++) {
        mtx[i][j] += multiplier * mtx[pivotRow][j];
      }
    }
  }
}



function updateOtherRowsBasis(mtx, pivotRow, pivotColumn) {
  var pivotRowLength = mtx[pivotRow].length;
  var pivotValue = mtx[pivotRow][pivotColumn];
  var rr = mtx.map(d => d[variablesCount+constraintsCount-equalCount]);;
  for (var i = 0; i <constraintsCount; i++) {
    if (i !== pivotRow) {
      var multiplier = -mtx[i][pivotColumn];
      for (var j = 0; j < pivotRowLength; j++) {
        mtx[i][j] += multiplier * mtx[pivotRow][j];
      }
    }
  }

}




function extractSolution(mtx, variablesCount, constraintsCount) {
  var solution = [];
  var basicVariables = findBasicVariables(mtx);

  for (var j = 0; j < variablesCount; j++) {
    if (basicVariables[j]) {
      for (var i = 0; i < constraintsCount; i++) {
        var row = mtx[i];
        if (row[j] === 1) {
          solution[j] = row[variablesCount + constraintsCount-equalCount];
          break;
        }
      }
    } else {
      solution[j] = 0;
    }
  }

  return solution;
}




function simplexMethod(mtx, optimizationType) {

  var outputDiv = document.getElementById("simplex-container");


  console.log(mtx.map(c=> c[variablesCount+constraintsCount-equalCount]));
  var b = mtx.map(c=> c[variablesCount+constraintsCount-equalCount]);
  var counr = 0;
  var solutionNotExists = false;

  if (b.some(x => x<0)) outputDiv.insertAdjacentHTML('beforeend', '<span>В столбце b присутствуют отрицательные значения.</span><br/>');

  var iterationNubmer = 1; 

  while (b.some(x => x<0)) {
    console.log("workkkk");
        var bMax = 1;
        var pivotRow = -1;
        var rowMaxValue = 1;
        var pivotColumn = -1;
        for (var i = 0; i<b.length-1; i++) {
          if (b[i] < 0 && b[i]<bMax) {
            bMax = b[i];
            pivotRow = i;
          }
        }



        outputDiv.insertAdjacentHTML('beforeend', '<span>Максимальное по модулю отрицательное |b|max = |' + (Math.round(bMax * 1000) / 1000) + '| находится в строке ' + (pivotRow+1) + '.</span><br/>');


        console.log("pivotRow when b<0 " + pivotRow);
        for (var j = 0; j < constraintsCount+variablesCount-equalCount; j++) {
          if (mtx[pivotRow][j] <0 && mtx[pivotRow][j] < rowMaxValue) {
            rowMaxValue = mtx[pivotRow][j];
            pivotColumn = j;
          }
        }

        if (rowMaxValue == 1) {
          outputDiv.insertAdjacentHTML('beforeend', '<span>В строке ' + (pivotRow+1) + ' отсутстуют отрицательные значения. Решение задачи не существует.</span><br/>');
          solutionNotExists = true;
          break;
        }


        outputDiv.insertAdjacentHTML('beforeend', '<span>Максимальный по модулю отрицательный элемент в строке ' + (pivotRow+1) + ' = ' + (Math.round(rowMaxValue * 1000) / 1000) + ' находится в столбце ' + (pivotColumn+1) + '.</span><br/>');
        outputDiv.insertAdjacentHTML('beforeend', '<span>В качестве базисной переменной берем x<sub>' + (pivotColumn+1) + '</sub>.</span><br/>');



        updatePivotRow(mtx, pivotRow, pivotColumn);
        updateOtherRows(mtx, pivotRow, pivotColumn);
        b = mtx.map(c=> c[variablesCount+constraintsCount-equalCount]);
        console.log(mtx);
        console.log(bMax + "  " + pivotRow + "  " + rowMaxValue + "  " + pivotColumn + "  ");
        counr++;


        outputDiv.insertAdjacentHTML('beforeend', '<p><b>Обновленная таблица:</b></p>');
        addHTMLtable(mtx);


        if (counr == 3) break;
  }

  if (solutionNotExists) {
    solution = -1;
    value = -1;
    return {
      solution: solution,
      value: value
    };

  }
  else if (optimizationType == "max") {
    while (true) {
      var pivotColumn = findPivotColumnMax(mtx);
      if (pivotColumn == -1) {
        console.log("Достигнуто оптимальное решение");
        var solution = extractSolution(mtx, variablesCount, constraintsCount);
        var value = mtx[constraintsCount][variablesCount + constraintsCount-equalCount];

        outputDiv.insertAdjacentHTML('beforeend', '<p><b>Проверяем план на оптимальность:</b> отрицательные дельты отсутствуют, следовательно <b>план оптимален</b>.</p>');

        break;
      }

      outputDiv.insertAdjacentHTML('beforeend', '<p><b>Проверяем план на оптимальность:</b> план <b>не оптимален</b>, так как Δ<sub>' + (pivotColumn+1) + '</sub> = ' + (Math.round(mtx[constraintsCount][pivotColumn] * 1000) / 1000) + ' отрицательна.</p>');
      outputDiv.insertAdjacentHTML('beforeend', '<p><b>Итерация ' + iterationNubmer + '</b></p>');
      iterationNubmer++;

      outputDiv.insertAdjacentHTML('beforeend', '<span>Определяем разрешающий столбец - столбец, в котором находится минимальная дельта: ' + (pivotColumn+1) + '.</span><br/>');


                        // Поиск опорного элемента
      var pivotRow = findPivotRow(mtx, pivotColumn);
      if (pivotRow === -1) {
                        // Задача не имеет ограничений
        console.log("Задача не имеет ограничений");
        var solution = -11;
        var value = -11;

        outputDiv.insertAdjacentHTML('beforeend', '<p><b>Функция не ограничена. Оптимальное решение отсутствует.</b></p>');

        break;
      }
               
      outputDiv.insertAdjacentHTML('beforeend', '<span>На пересечении найденных строки и столбца находится разрешающий элемент: ' + (Math.round(mtx[pivotRow][pivotColumn] * 1000) /1000) + '.</span><br/>');
      outputDiv.insertAdjacentHTML('beforeend', '<span>В качестве базисной переменной берем x<sub>' + (pivotColumn+1) + '</sub>.</span><br/>');

      updatePivotRow(mtx, pivotRow, pivotColumn);       
      updateOtherRows(mtx, pivotRow, pivotColumn);

      outputDiv.insertAdjacentHTML('beforeend', '<br/>');
      addHTMLtable(mtx);

      var solution = extractSolution(mtx, variablesCount, constraintsCount);

      var value = mtx[constraintsCount][variablesCount + constraintsCount-equalCount];


    }
    return {
      solution: solution,
      value: value
    };
  }
  else {
    while (true) {
      var pivotColumn = findPivotColumnMin(mtx);
      if (pivotColumn == -1) {

        console.log("Достигнуто оптимальное решение");
        var solution = extractSolution(mtx, variablesCount, constraintsCount);
        var value = mtx[constraintsCount][variablesCount + constraintsCount-equalCount];

        outputDiv.insertAdjacentHTML('beforeend', '<p><b>Проверяем план на оптимальность:</b> положительные дельты отсутствуют, следовательно <b>план оптимален</b>.</p>');

        break;
      }
      
      outputDiv.insertAdjacentHTML('beforeend', '<p><b>ОПроверяем план на оптимальность:</b> план <b>не оптимален</b>, так как Δ<sub>' + (pivotColumn+1) + '</sub> = ' + (Math.round(mtx[constraintsCount][pivotColumn] * 1000) / 1000) + ' положительна.</p>');
      outputDiv.insertAdjacentHTML('beforeend', '<p><b>Итерация ' + iterationNubmer + '</b></p>');
      iterationNubmer++;

      outputDiv.insertAdjacentHTML('beforeend', '<span>Определяем разрешающий столбец - столбец, в котором находится минимальная дельта: ' + (pivotColumn+1) + '.</span><br/>');


                        // Поиск опорного элемента
      var pivotRow = findPivotRow(mtx, pivotColumn);
      if (pivotRow === -1) {
        console.log("Задача не имеет ограничений");
        var solution = -11;
        var value = -11;
        outputDiv.insertAdjacentHTML('beforeend', '<p><b>Функция не ограничена. Оптимальное решение отсутствует.</b></p>');
        break;
      }


      outputDiv.insertAdjacentHTML('beforeend', '<span>На пересечении найденных строки и столбца находится разрешающий элемент: ' + (Math.round(mtx[pivotRow][pivotColumn] * 1000) /1000) + '.</span><br/>');
      outputDiv.insertAdjacentHTML('beforeend', '<span>В качестве базисной переменной берем x<sub>' + (pivotColumn+1) + '</sub>.</span><br/>');

      updatePivotRow(mtx, pivotRow, pivotColumn);
      updateOtherRows(mtx, pivotRow, pivotColumn);

      outputDiv.insertAdjacentHTML('beforeend', '<br/>');
      addHTMLtable(mtx);

      var solution = extractSolution(mtx, variablesCount, constraintsCount);
      var value = mtx[constraintsCount][variablesCount + constraintsCount-equalCount];
    }
    return {
      solution: solution,
      value: value
    };
  }
}




function solve() {
  try {
    variablesCount = Number(document.getElementById("variables").value); 
    constraintsCount = Number(document.getElementById("constraints").value);
    var optimizationType = document.getElementById('mode').value;
  }
  catch (err) {
    alert("Укажите количество переменных и ограничений!");
    return;
  }

  var outputDiv = document.getElementById("simplex-container");
  outputDiv.innerHTML = '<h3 class="answer">Решение</h3>';

  var mtx = []
  var mtxCopy = []
  var cCopy =[]
  var c = []
  var b = []

  var bRemember = [];

  var equalRow = []

  for (var i = 0; i<constraintsCount; i++) {
    if (document.getElementById('cond-'+i).value == "≤") {
      b[i] = Number(document.getElementById('const-'+i+'-value').value);
    }
    else if (document.getElementById('cond-'+i).value == "≥") {
      if (Number(document.getElementById('const-'+i+'-value').value) == 0) {
        b[i] = 0;
      }
      else b[i] = opposite(Number(document.getElementById('const-'+i+'-value').value));
      bRemember.push(i);
    }
    else b[i] = Number(document.getElementById('const-'+i+'-value').value);
  }
  b[constraintsCount]=0;  


  for (var i = 0; i < constraintsCount; i++) {
    mtx[i] = [];
    mtxCopy[i] = [];
  }

  for (var i = 0; i < constraintsCount; i++) { 
    if (document.getElementById('cond-'+i).value == "=") {
      equalRow.push(i);  
    }             
    for (var j = 0; j < variablesCount; j++) {
      if (document.getElementById('cond-'+i).value == "≤") {
        mtx[i][j] = Number(document.getElementById('const-'+i+'-'+j).value);
        mtxCopy[i][j] = Number(document.getElementById('const-'+i+'-'+j).value);
      }
      else if (document.getElementById('cond-'+i).value == "≥") {
        if (Number(document.getElementById('const-'+i+'-'+j).value) == 0) {
          mtx[i][j] = 0;
          mtxCopy[i][j] = 0;
        } else {
          mtx[i][j] = opposite(Number(document.getElementById('const-'+i+'-'+j).value));
          mtxCopy[i][j] = opposite(Number(document.getElementById('const-'+i+'-'+j).value));
        }
        
      }
      else { 
        mtx[i][j] = Number(document.getElementById('const-'+i+'-'+j).value);
        mtxCopy[i][j] = Number(document.getElementById('const-'+i+'-'+j).value);
      }
    }
  }


  if (bRemember.length > 0) {
    var p = "Меняем знаки у ограничений с ≥, путём умножения на -1:";
    outputDiv.innerHTML += p;
    for (var i=0; i < bRemember.length; i++) {
      var row = bRemember[i];
      var sign = (mtx[row][0] >= 0) ? '' : '-';
      outputDiv.insertAdjacentHTML('beforeend', '<br/><span>' + sign + ' ' + Math.abs(mtx[row][0]) + 'x<sub>' + 1 + '</sub> ');
      for (var j=1; j < mtx[row].length; j++) {
        sign = (mtx[row][j] >= 0) ? '+' : '-';
        outputDiv.insertAdjacentHTML('beforeend', sign + ' '  + Math.abs(mtx[row][j]) + 'x<sub>' + (j+1) + '</sub> ');
      }
      outputDiv.insertAdjacentHTML('beforeend', ' ≤ ' + b[row] + '</span><br/>');
    }
  }

  outputDiv.insertAdjacentHTML('beforeend', '<span>Для каждого ограничения с неравенством добавляем дополнительные переменные ');
  for (var j = variablesCount; j < variablesCount+constraintsCount-equalRow.length-1; j++) {
    outputDiv.insertAdjacentHTML('beforeend', 'x<sub>' + (j+1) + '</sub>, ');
  }
  outputDiv.insertAdjacentHTML('beforeend','x<sub>' + (variablesCount+constraintsCount-equalRow.length) + '</sub>.</span><br/>');


  for (var i = 0; i < constraintsCount; i++) {
    for (var j = variablesCount; j < variablesCount+constraintsCount-equalRow.length; j++) {
        mtx[i][j] = 0;
        mtxCopy[i][j] = 0;  
    }
    mtx[i][variablesCount+constraintsCount-equalRow.length]=b[i];
    mtxCopy[i][variablesCount+constraintsCount-equalRow.length]=b[i];
    }



  for (var i=0; i < variablesCount; i++) {
    if (Number(document.getElementById('var'+i).value) == 0) {
      c[i] = 0;
      cCopy[i] = 0;
    }
    else { 
      c[i] = opposite(Number(document.getElementById('var'+i).value));
      cCopy[i] = opposite(Number(document.getElementById('var'+i).value));
      console.log("с " + opposite(Number(document.getElementById('var'+i).value)));
  }
}
for (var i=variablesCount; i < variablesCount+constraintsCount-equalRow.length+1; i++) {
  c[i] = 0;
  cCopy[i] = 0;
}

mtx.push(c);
mtxCopy.push(c);
console.log("cCopy " + cCopy);

   var oneCount = variablesCount-equalRow.length; 
   var j = variablesCount;
   for (var i = 0; i < constraintsCount; i++) {
      if (equalRow.filter((el) => el === i).length === 0) {
        mtx[i][j]=1;
        mtxCopy[i][j]=1;
        j+=1;
      }
      console.log("hiijiji " + mtx[i]);
    }


equalCount = equalRow.length;

var basicVars = findBasicVariablesBasis(mtx);
      console.log("ДО " + equalRow);
var basisVarsTrue = [];
for (var i=0; i<basicVars.length; i++) {
  if (basicVars[i] == true) {
    basisVarsTrue.push(i);
  }
}
console.log("tru basis " + basisVarsTrue);

//var p = "Ищем начальное базисное решение:";
outputDiv.insertAdjacentHTML('beforeend', '<p><b>Ищем начальное базисное решение:<b></p>');
var basisCount = 0;
for (var i =0; i < constraintsCount; i++) {
  var type = document.getElementById('cond-'+i).value;
  if (type == "≥" || type == "≤") {
    outputDiv.insertAdjacentHTML('beforeend', 'Ограничение ' + (i+1) + ' содержит неравенство, базисной будет добавленная дополнительная переменная x<sub>' + (basisVarsTrue[basisCount]+1) + '</sub>.<br/>');
    basisCount++;
  }
  else outputDiv.insertAdjacentHTML('beforeend', 'Ограничение ' + (i+1) + ' содержит равенство. Базисная переменная для этого ограничения будет определена позднее.<br/>');
}
outputDiv.insertAdjacentHTML('beforeend', '<p><b>Начальная симплекс-таблица<b></p>');
addHTMLtable(mtx);



while (equalRow.length != 0) {
  console.log("осталось с равно " + equalRow.length);
  for (var i = 0; i < variablesCount+constraintsCount-equalCount; i++) {
    console.log("Фильтр для колонки " + i + " показывает " + basicVars[i]);

    if (basicVars[i] == false && mtx[equalRow[0]][i] !=0) {
      console.log("equalRow " + equalRow[0] + " , equalCOlumn(i) " + i);


      outputDiv.insertAdjacentHTML('beforeend', '<span>В качестве базисной переменной для строки ' + (equalRow[0]+1) + ' берём x<sub>' + (i+1) + '</sub>.</span><br/>');

      updatePivotRow(mtx, equalRow[0], i);
      updateOtherRows(mtx, equalRow[0], i);
      equalRow.shift();
      console.log("ПОСЛЕ " + equalRow);
      basicVars = findBasicVariablesBasis(mtx);

      outputDiv.insertAdjacentHTML('beforeend', '<p><b>Таблица:</b></p>');
      addHTMLtable(mtx);
      break;
    }

  }
}


var mtxCopy2 = [];
for (var i=0; i<constraintsCount; i++) {
  mtxCopy2[i] = [];
  for (var j=0; j<constraintsCount+variablesCount-equalCount; j++) {
    mtxCopy2[i][j] = mtx[i][j];
  }
}



mtxCopy2.push(c);
console.log("original mtx ");
console.log(mtxCopy);
console.log("original with basis mtx ");
console.log(mtxCopy2);




var result = simplexMethod(mtx, optimizationType)

console.log("matrix end");
console.log(mtx);

var answerHTML = '<h3 class="answer">Ответ:</h3> ';
result.innerHTML = "";


if (result.solution == -1) {
  var resultHtml = '<h3>Ответ</h3><p>Решение задачи не существует.</p>';
  answerHTML += '<p>Решение задачи не существует.</p>';
} else if (result.solution == -11) {
   var resultHtml = '<h3>Ответ</h3></p><p>Функция не ограничена. Оптимальное решение отсутствует.</p>';
   answerHTML += '<p><Функция не ограничена. Оптимальное решение отсутствует.</p>';
}
else {
  var resultHtml = '<h3>Ответ</h3>';
  for (var i = 0; i < variablesCount; i++) {
    resultHtml += 'x<sub>' + (i + 1) + '</sub> = ' + Math.round(result.solution[i] * 1000) / 1000 + ', ';
    answerHTML += 'x<sub>' + (i + 1) + '</sub> = ' + Math.round(result.solution[i] * 1000) / 1000 + ', ';
  }
  resultHtml += 'F = ' + Math.round(result.value * 1000) / 1000 + '</p';
  answerHTML += 'F = ' + Math.round(result.value * 1000) / 1000 + '</p>';
}
outputDiv.innerHTML += answerHTML;
document.getElementById('result').innerHTML = resultHtml;





}


function addHTMLtable(mtx) {
  var outputDiv = document.getElementById("simplex-container");
  var table = document.createElement("table");
  table.classList.add("bordered");

  var basicVars = findBasicVariables(mtx);

  var thead = document.createElement("thead");
      var headerRow = document.createElement("tr");

      var thEmpty = document.createElement("th");
      thEmpty.textContent = "";
      headerRow.appendChild(thEmpty);

      for (var j = 0; j < variablesCount + constraintsCount - equalCount; j++) {
        var th = document.createElement("th");
        th.textContent = "x" + (j + 1);
        headerRow.appendChild(th);
      }
      var th = document.createElement("th");
      th.textContent = "b";
      headerRow.appendChild(th);

      thead.appendChild(headerRow);
      table.appendChild(thead);

      var tbody = document.createElement("tbody");
      for (var row = 0; row < constraintsCount + 1; row++) {
        var dataRow = document.createElement("tr");

        // Добавляем базовую переменную в первую колонку
        var basicVar = document.createElement("td");
        if (row == constraintsCount) {
          basicVar.textContent = "Δ";
        }
        else {
          for (var col = 0; col < variablesCount + constraintsCount - equalCount + 1; col++) {
            if (mtx[row][col] === 1 && basicVars[col] == true) {
              basicVar.textContent = "x" + (col + 1);
              break;
            }
          }
        }
        dataRow.appendChild(basicVar);

        for (var col = 0; col < variablesCount + constraintsCount - equalCount + 1; col++) {
          var td = document.createElement("td");
          td.textContent = Math.round(mtx[row][col] * 1000) / 1000;
          dataRow.appendChild(td);
        }
        tbody.appendChild(dataRow);
      }
      var lastRow = tbody.lastChild;
      lastRow.classList.add("highlighted");
      table.appendChild(tbody);

      outputDiv.appendChild(table);
}



function add() {
  result.innerHTML = "";
  func_block.innerHTML = "";
  constraint_block.innerHTML = "";
  var i,j;
  variables = Number(document.getElementById("variables").value);
  constraints = Number(document.getElementById("constraints").value);
  if (variables <=0 || constraints <=0) {
    if (variables <=0) {
      var p = "Количество переменных не может быть меньше 0!";
      func_block.innerHTML = p;
    }
    if (constraints <=0) {
      var p = "Количество ограничений не может быть меньше 0!";
      constraint_block.innerHTML = p;
    }
  }
  else {


    for (i=0; i < variables-1; i++) {
      var id = 'var'+i;
      func_block.insertAdjacentHTML('beforeend', '<input type="number" id="var'+i+'" placeholder="0" inputmode="decimal"> x<sub>' + (i+1) + '</sub> + ');
    }
    func_block.insertAdjacentHTML('beforeend', '<input type="number" id="var'+(variables-1)+'" placeholder="0" inputmode="decimal"> x<sub>' + (i+1) + '</sub>');
    func_block.insertAdjacentHTML('beforeend', ' <span>→</span> <select id="mode"><option>min</option><option>max</option></select><br>'); 

    for (j=0; j < constraints; j++) {
      for (i=0; i < variables-1; i++) {
        constraint_block.insertAdjacentHTML('beforeend', '<input type="number" id="const-'+j+'-'+i+'" placeholder="0" inputmode="decimal"> x<sub>' + (i+1) + '</sub> + ');
      }
      constraint_block.insertAdjacentHTML('beforeend', '<input type="number" id="const-'+j+'-'+(variables-1)+'" placeholder="0" inputmode="decimal"> x<sub>' + (i+1) + '</sub> ');
      constraint_block.insertAdjacentHTML('beforeend', '<select id="cond-'+j+'"><option value="≤">≤</option><option value="=">=</option><option value="≥">≥</option></select>'); 
      constraint_block.insertAdjacentHTML('beforeend', '<input type="number" id="const-'+j+'-value" placeholder="0" inputmode="decimal"><br>'); 
    }
  }
}
