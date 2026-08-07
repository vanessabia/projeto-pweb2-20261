import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "../../../app/store";

import {
  selectCategories,
  selectCategoriesLoading,
  selectSpendingLimitsError,
  selectSpendingLimitsLoading,
} from "../spendingLimitSelectors";

import {
  createSpendingLimit,
  fetchCategories,
} from "../spendingLimitsThunks";

interface SpendingLimitFormProps {
  onSuccess?: () => void;
}

function SpendingLimitForm({
  onSuccess,
}: SpendingLimitFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(
    selectCategoriesLoading
  );
  const loading = useSelector(
    selectSpendingLimitsLoading
  );
  const error = useSelector(
    selectSpendingLimitsError
  );

  const [categoryId, setCategoryId] = useState("");
  const [limitAmount, setLimitAmount] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const parsedCategoryId = Number(categoryId);
    const parsedLimitAmount = Number(limitAmount);

    if (!parsedCategoryId) {
      alert("Selecione uma categoria.");
      return;
    }

    if (
      !parsedLimitAmount ||
      parsedLimitAmount <= 0
    ) {
      alert(
        "Informe um valor de limite maior que zero."
      );
      return;
    }

    const result = await dispatch(
      createSpendingLimit({
        categoryId: parsedCategoryId,
        limitAmount: parsedLimitAmount,
      })
    );

    if (
      createSpendingLimit.fulfilled.match(result)
    ) {
      setCategoryId("");
      setLimitAmount("");
      onSuccess?.();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="spending-limit-form"
    >
      <div className="spending-limit-form-group">
        <label htmlFor="category">
          Categoria
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value)
          }
          disabled={
            categoriesLoading || loading
          }
          required
        >
          <option value="">
            {categoriesLoading
              ? "Carregando categorias..."
              : "Selecione uma categoria"}
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="spending-limit-form-group">
        <label htmlFor="limitAmount">
          Valor do limite mensal
        </label>

        <input
          id="limitAmount"
          type="number"
          min="0.01"
          step="0.01"
          value={limitAmount}
          onChange={(event) =>
            setLimitAmount(event.target.value)
          }
          placeholder="Ex.: 500,00"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <p
          className="spending-limits-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="spending-limit-submit"
        disabled={
          loading || categoriesLoading
        }
      >
        {loading
          ? "Salvando..."
          : "Cadastrar limite"}
      </button>
    </form>
  );
}

export default SpendingLimitForm;
