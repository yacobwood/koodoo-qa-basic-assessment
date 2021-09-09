const {
  standardDeviation,
  sanitizeAmounts,
  roundToTwoDp,
  analysePayments
} = require('./analyze.js')
const test = require('ava')

test('Standard Deviation is correct for Basic Data', t => {
  t.deepEqual(standardDeviation([1, 2, 2, 2, 1, 1]), 0.5)
})

test('Payments are analysed correctly', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1,
    "TransactionInformation": "Payment One"
  },
    {
      "Amount": 2,
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 3,
      "TransactionInformation": "Payment Three"
    },
    {
      "Amount": 4,
      "TransactionInformation": "Payment Four"
    }
  ]), {
    max: 4,
    mean: 2.5,
    median: 2.5,
    min: 1,
    standardDeviation: 1.12,
  })
})

test('Payments with missing amounts are excluded', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1,
    "TransactionInformation": "Payment One"
  },
    {
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 3,
      "TransactionInformation": "Payment Three"
    },
    {
      "Amount": 4,
      "TransactionInformation": "Payment Four"
    }
  ]), {
    max: 4,
    mean: 2.67,
    median: 3,
    min: 1,
    standardDeviation: 1.25,
  })
})

test('Payments with a lower case a for Amounts are successfully processed', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1,
    "TransactionInformation": "Payment One"
  },
    {
      "amount": 8,
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 28,
      "TransactionInformation": "Payment Three"
    },
  ]), {
    max: 28,
    mean: 14.5,
    median: 14.5,
    min: 1,
    standardDeviation: 13.5,
  })
})

test('Payments with large amounts are successfully processed', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1321546167,
    "TransactionInformation": "Payment One"
  },
    {
      "amount": 231656548,
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 36551169,
      "TransactionInformation": "Payment Three"
    },
  ]), {
    max: 1321546167,
    mean: 679048668,
    median: 679048668,
    min: 36551169,
    standardDeviation: 642497499,
  })
})

test('Payments with negative amounts are successfully processed', t => {
  t.deepEqual(analysePayments([{
    "Amount": -1321546167,
    "TransactionInformation": "Payment One"
  },
    {
      "amount": -231656548,
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": -36551169,
      "TransactionInformation": "Payment Three"
    },
  ]), {
    max: -36551169,
    mean: -679048668,
    median: -679048668,
    min: -1321546167,
    standardDeviation: 642497499,
  })
})

test('Payments with Amounts containing >2 decimal places are successfully rounded back to 2 decimal places', t => {
  t.deepEqual(roundToTwoDp(13.21646167), 13.22)
})

test('Payments with amounts containing decimal places are rounded up correctly', t => {
  t.deepEqual(roundToTwoDp(7.896), 7.9)
})

test('Payments with amounts containing decimal places are rounded down correctly', t => {
  t.deepEqual(roundToTwoDp(7.894), 7.89)
})

test('Payments with numeric amounts as strings are successfully processed', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1,
    "TransactionInformation": "Payment One"
  },
    {
      "Amount": "2",
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 3,
      "TransactionInformation": "Payment Three"
    },
    {
      "Amount": "4",
      "TransactionInformation": "Payment Four"
    }
  ]), {
    max: 4,
    mean: 2.5,
    median: 2.5,
    min: 1,
    standardDeviation: 1.12,
  })
})

test('Payments with non numeric amounts are sanitized', t => {
  t.deepEqual(sanitizeAmounts([{"Amount": "four"}]), [NaN])
})

test('Payments with a comma in the amount are sanitized', t => {
  t.deepEqual(sanitizeAmounts([{"Amount": "1,234"}]), [1234])
})

test('Payments with missing Transaction Information are not processed', t => {
  t.deepEqual(analysePayments([{
    "Amount": 1,
    "TransactionInformation": "Payment One"
  },
    {
      "Amount": 2,
      "TransactionInformation": "Payment Two"
    },
    {
      "Amount": 3,
    },
    {
      "Amount": 4,
      "TransactionInformation": "Payment Four"
    }
  ]), {
    max: 4,
    mean: 2.5,
    median: 2.5,
    min: 1,
    standardDeviation: 1.12,
  })
})

test('Blank arrays are successfully processed', t => {
  t.deepEqual(analysePayments([]), {
    max: 0,
    mean: 0,
    median: 0,
    min: 0,
    standardDeviation: 0,
  })
})
