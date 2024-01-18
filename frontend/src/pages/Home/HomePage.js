import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search/Search";
import Tags from "../../components/Tags1/Tags";
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import classes from "./homePage.module.css";
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from "../../services/foodService";
import NotFound from "../../components/NotFound/NotFound";

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "FOODS_LOADED":
      return { ...state, foods: action.payload };
    case "TAGS_LOADED":
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();

  useEffect(() => {
    getAllTags().then((tags) =>
      // @ts-ignore
      dispatch({ type: "TAGS_LOADED", payload: tags })
    );

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then((foods) =>
      // @ts-ignore
      dispatch({ type: "FOODS_LOADED", payload: foods })
    );
  }, [searchTerm, tag]);

  return (
    <>
      <div className={classes.container}>
        <Search />
        <Tags tags={tags} forFoodPage={undefined} />
        {foods.length === 0 && <NotFound linkText="Reset Search" />}
        <Thumbnails foods={foods} />
      </div>
    </>
  );
}
