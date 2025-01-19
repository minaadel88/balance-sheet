import React, { useState, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { FileDown, Plus, Trash2 } from 'lucide-react';

interface FinancialEntry {
  id: string;
  description: string;
  amount: number;
}

function App() {
  const [startBalance, setStartBalance] = useState<number>(0);
  const [incomeEntries, setIncomeEntries] = useState<FinancialEntry[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [expenseEntries, setExpenseEntries] = useState<FinancialEntry[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [notes, setNotes] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { toPDF, targetRef } = usePDF({
    filename: 'الميزانية-المالية.pdf',
    page: { format: 'a4' }
  });

  const addEntry = (type: 'income' | 'expense') => {
    const newEntry = { id: Date.now().toString(), description: '', amount: 0 };
    if (type === 'income') {
      setIncomeEntries([...incomeEntries, newEntry]);
    } else {
      setExpenseEntries([...expenseEntries, newEntry]);
    }
  };

  const removeEntry = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeEntries(incomeEntries.filter(entry => entry.id !== id));
    } else {
      setExpenseEntries(expenseEntries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (
    id: string,
    field: 'description' | 'amount',
    value: string | number,
    type: 'income' | 'expense'
  ) => {
    const updateEntries = (entries: FinancialEntry[]) =>
      entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      );

    if (type === 'income') {
      setIncomeEntries(updateEntries(incomeEntries));
    } else {
      setExpenseEntries(updateEntries(expenseEntries));
    }
  };

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = startBalance + totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-right" dir="rtl">
      <div
        ref={targetRef}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ميزانية صندوق عمارة 32 عمارات الاخاء 
          <p>(عمارات الشرطة)</p>
        </h1>

         {/* فترة الحساب */}
         <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">فترة الحساب</h2>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حتى تاريخ:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* رصيد بداية العام */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            رصيد بداية الفترة
          </h2>
          <input
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="أدخل الرصيد الافتتاحي"
          />
        </div>

        {/* قسم الدخل */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">الدخل</h2>
          {incomeEntries.map((entry) => (
            <div key={entry.id} className="flex gap-4 mb-4">
              <input
                type="text"
                value={entry.description}
                onChange={(e) =>
                  updateEntry(entry.id, 'description', e.target.value, 'income')
                }
                className="flex-1 p-2 border rounded-md"
                placeholder="وصف الدخل"
              />
              <input
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  updateEntry(entry.id, 'amount', Number(e.target.value), 'income')
                }
                className="w-48 p-2 border rounded-md"
                placeholder="المبلغ"
              />
              <button
                onClick={() => removeEntry(entry.id, 'income')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addEntry('income')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50 p-2 rounded-md"
          >
            <Plus size={20} />
            <span>إضافة دخل جديد</span>
          </button>
        </div>

        {/* قسم المصروفات */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">المصروفات</h2>
          {expenseEntries.map((entry) => (
            <div key={entry.id} className="flex gap-4 mb-4">
              <input
                type="text"
                value={entry.description}
                onChange={(e) =>
                  updateEntry(entry.id, 'description', e.target.value, 'expense')
                }
                className="flex-1 p-2 border rounded-md"
                placeholder="وصف المصروف"
              />
              <input
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  updateEntry(entry.id, 'amount', Number(e.target.value), 'expense')
                }
                className="w-48 p-2 border rounded-md"
                placeholder="المبلغ"
              />
              <button
                onClick={() => removeEntry(entry.id, 'expense')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addEntry('expense')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50 p-2 rounded-md"
          >
            <Plus size={20} />
            <span>إضافة مصروف جديد</span>
          </button>
        </div>

        {/* الإجماليات */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">إجمالي الدخل:</span>
            <span className="text-green-600">{totalIncome} جنيه</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-semibold">إجمالي المصروفات:</span>
            <span className="text-red-600">{totalExpenses} جنيه</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>صافي الرصيد:</span>
            <span className={netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {netBalance} جنيه
            </span>
          </div>
        </div>

        {/* قسم الملاحظات */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">ملاحظات</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border rounded-md min-h-[120px] resize-y"
            placeholder="أضف ملاحظاتك هنا..."
          />
        </div>
      </div>

      {/* زر تحميل PDF */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-center">
        <button
          onClick={() => toPDF()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileDown size={20} />
          <span>تحميل كملف PDF</span>
        </button>
      </div>
    </div>
  );
}

export default App;