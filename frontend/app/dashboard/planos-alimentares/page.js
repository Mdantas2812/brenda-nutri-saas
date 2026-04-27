"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Planos() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";
    fetch(`${API}/food-plans`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setPlans);
  }, []);

  return (
    <AdminLayout>
      <h1 className="h1">Planos alimentares</h1>
      <p className="subtitle">Modelo no estilo de rotina por refeições, horários, opções e orientações.</p>
      <div className="panel">
        {plans.map(plan => (
          <div className="meal" key={plan.id}>
            <h2>{plan.title}</h2>
            <p><b>Paciente:</b> {plan.Client?.name}</p>
            <p>{plan.generalGuidelines}</p>
            {plan.Meals?.map(meal => (
              <div className="meal" key={meal.id}>
                <h3>{meal.time} - {meal.name}</h3>
                <p>{meal.instructions}</p>
                <ul>{meal.MealOptions?.map(o => <li key={o.id}>{o.description} {o.calories ? `, ${o.calories} kcal` : ""}</li>)}</ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
