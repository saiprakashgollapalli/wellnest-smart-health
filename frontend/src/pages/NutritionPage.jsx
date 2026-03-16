import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCoffee } from 'react-icons/fi';
import { nutritionService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Pre-Workout',
  'Post-Workout'
];

const EMPTY = {
  mealType: 'Breakfast',
  foodItems: '',
  quantity: '',
  unit: 'g',
  date: new Date().toISOString().split('T')[0]
};

export default function NutritionPage() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showAnalytics,setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () =>
    nutritionService.getAll()
      .then(r => setLogs(r.data))
      .catch(() => toast.error('Failed to load nutrition logs'))
      .finally(() => setLoading(false));

  const groupedLogs = logs.reduce((acc, log) => {
    const key = `${log.date}-${log.mealType}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {

      let convertedQuantity = Number(form.quantity) || 0;

      if (form.unit === 'pcs') {
        convertedQuantity = convertedQuantity * 50;
      }

      const payload = {
        mealType: form.mealType,
        foodItems: form.foodItems,
        quantityInGrams: convertedQuantity,
        date: form.date
      };

      if (editId) {
        await nutritionService.update(editId, payload);
        toast.success('Updated!');
      } else {
        await nutritionService.create(payload);
        toast.success('Food added 🥗');
      }

      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      fetchLogs();

    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (l) => {
    setForm({
      mealType: l.mealType,
      foodItems: l.foodItems,
      quantity: l.quantityInGrams,
      unit: 'g',
      date: l.date
    });
    setEditId(l.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await nutritionService.delete(id);
      toast.success('Deleted');
      fetchLogs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = logs.filter(l => l.date === today);

  const todayCalories = todayMeals.reduce((s, l) => s + (l.caloriesConsumed || 0), 0);
  const todayProtein = todayMeals.reduce((s, l) => s + (l.proteinGrams || 0), 0);
  const todayCarbs = todayMeals.reduce((s, l) => s + (l.carbsGrams || 0), 0);
  const todayFat = todayMeals.reduce((s, l) => s + (l.fatGrams || 0), 0);

  const analyticsData = logs.map(l => ({
    date: l.date,
    calories: l.caloriesConsumed || 0,
    protein: l.proteinGrams || 0,
    carbs: l.carbsGrams || 0,
    fat: l.fatGrams || 0
  }));

  const macroData = [
    { name: "Protein", value: todayProtein },
    { name: "Carbs", value: todayCarbs },
    { name: "Fat", value: todayFat }
  ];

  const COLORS = ["#10b981","#6366f1","#f59e0b"];

  return (
    <>
      <div className="px-[24px] py-[32px]">

        <div className="max-w-[900px] mx-auto flex flex-col gap-[24px]">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-[1.8rem] flex items-center gap-[10px]">
                <FiCoffee className="text-[var(--emerald)]" />
                Nutrition Log
              </h1>

              <p className="text-[var(--text-secondary)]">
                Add each food item separately. Items under same meal are grouped automatically.
              </p>
            </div>

            <div className="flex gap-[12px]">

              <button
                className="btn-ghost"
                onClick={()=>setShowAnalytics(prev=>!prev)}
              >
               📊 View Analytics
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  setShowForm(true);
                  setForm(EMPTY);
                  setEditId(null);
                }}
              >
                <FiPlus /> Add Food
              </button>

            </div>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 gap-[16px]">

            <div className="bg-[var(--bg-card)] p-[20px] rounded-[12px] border border-[var(--border)]">

              <h4>Today</h4>

              <p className="text-[1.6rem] font-bold text-[var(--emerald)]">
                {todayCalories} kcal
              </p>

              <p className="text-[0.85rem] text-[var(--text-muted)]">
                P {todayProtein}g · C {todayCarbs}g · F {todayFat}g
              </p>

            </div>

          </div>

          {/* ANALYTICS */}
          {showAnalytics && (

            <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)] flex flex-col gap-[24px]">

              <h3 className="text-[1.2rem] font-semibold">
                Nutrition Analytics
              </h3>

              <div className="grid md:grid-cols-2 gap-[24px]">

                <div className="h-[260px]">

                  <p className="text-[var(--text-muted)] mb-[8px]">
                    Calories Trend
                  </p>

                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <XAxis dataKey="date" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip />
                      <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3}/>
                    </LineChart>
                  </ResponsiveContainer>

                </div>

                <div className="h-[260px]">

                  <p className="text-[var(--text-muted)] mb-[8px]">
                    Today's Macros
                  </p>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {macroData.map((entry,index)=>(
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          )}

          {/* FORM */}
          {showForm && (
            <div className="bg-[var(--bg-card)] p-[24px] rounded-[12px] border border-[var(--border)]">

              <h3>{editId ? 'Edit Food Item' : 'Add Food Item'}</h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">

                <div className="grid grid-cols-2 gap-[16px]">

                  <select
                    value={form.mealType}
                    onChange={e => setForm(f => ({ ...f, mealType: e.target.value }))}
                  >
                    {MEAL_TYPES.map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />

                </div>

                <input
                  type="text"
                  placeholder="Food Name"
                  required
                  value={form.foodItems}
                  onChange={e => setForm(f => ({ ...f, foodItems: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-[16px]">

                  <input
                    type="number"
                    placeholder="Quantity"
                    required
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  />

                  <select
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  >
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pcs">Pieces</option>
                  </select>

                </div>

                <div className="flex justify-end gap-[12px]">

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editId ? 'Update' : 'Add'}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* LIST */}
          {loading ? (
            <div className="text-center py-[60px]">
              <div className="spinner" />
            </div>
          ) : Object.keys(groupedLogs).length === 0 ? (

            <div className="text-center py-[60px] text-[var(--text-muted)]">

              <FiCoffee size={48} />

              <h3>No meals logged</h3>

              <p>Start tracking your nutrition today 🥗</p>

            </div>

          ) : (

            <div className="flex flex-col gap-[18px]">

              {Object.entries(groupedLogs).map(([key, items]) => {

                const totalCalories = items.reduce(
                  (sum, l) => sum + (l.caloriesConsumed || 0),
                  0
                );

                const [date, mealType] = key.split('-');

                return (

                  <div
                    key={key}
                    className="bg-[var(--bg-card)] rounded-[12px] border border-[var(--border)] p-[18px] flex flex-col gap-[14px]"
                  >

                    <div className="flex justify-between items-center border-b border-[var(--border)] pb-[8px]">

                      <div>
                        <span className="badge badge-blue">{mealType}</span>

                        <span className="ml-[10px] text-[var(--text-muted)]">
                          {date}
                        </span>
                      </div>

                      <strong className="text-[1.1rem] text-[var(--emerald)]">
                        {totalCalories} kcal
                      </strong>

                    </div>

                    {items.map(l => (

                      <div
                        key={l.id}
                        className="py-[8px] border-b border-[var(--border)] flex flex-col gap-[6px]"
                      >

                        <div className="font-medium">
                          {l.foodItems} ({l.quantityInGrams} g)
                        </div>

                        <div className="flex gap-[16px] text-[0.85rem] text-[var(--text-muted)]">
                          <span>P {l.proteinGrams || 0}g</span>
                          <span>C {l.carbsGrams || 0}g</span>
                          <span>F {l.fatGrams || 0}g</span>
                        </div>

                        <div className="flex gap-[10px] justify-end">

                          <button
                            className="btn-ghost"
                            onClick={() => handleEdit(l)}
                          >
                            <FiEdit2 /> Edit
                          </button>

                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(l.id)}
                          >
                            <FiTrash2 /> Delete
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>
    </>
  );
}