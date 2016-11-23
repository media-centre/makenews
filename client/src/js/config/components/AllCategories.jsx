/*eslint react/prefer-es6-class:0 no-magic-numbers:0*/
import React, { PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { displayAllCategoriesAsync } from "../actions/AllCategoriesActions";
import { highLightTabAction } from "../../tabs/TabActions";
import { createCategory } from "../actions/CategoryActions";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions";
import History from "../../History";

export class AllCategories extends React.Component {

    componentWillMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.props.dispatch(highLightTabAction(["Configure", "RSS"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(displayAllCategoriesAsync());
    }

    _createNewCategory() {
        try {
            if(!this.entered) {
                this.entered = true;
                let history = History.getHistory();
                this.props.dispatch(createCategory((response)=>{
                    history.push("/configure/category/" + response.id + "/" + response.name);
                    this.entered = false;
                }));
            }
        } catch(error) {
            this.entered = false;
        }
    }

    renderCategoryLists() {
        let categoriesArray = [];
        categoriesArray.push(<li className="add-new" id="addNewCategoryButton" key ="0" onClick={() => this._createNewCategory()}>
            <div className="navigation-link">
                <div className="v-center t-center text-container">
                    <span ref="addNewCategoryLink">{this.props.allCategoriesPageStrings.addNewCategoryLabel}</span>
                </div>
            </div>
        </li>);
        this.props.allCategories.categories.map((category, index) =>
            categoriesArray.push(
                <li key={index + 1} className="category">
                    <Link ref={"categoryLink_" + category._id} to={"/configure/category/" + category._id + "/" + category.name} className="navigation-link">
                        <div className="v-center t-center text-container">
                            <span ref={"category_" + category._id}>{category.name}</span>
                        </div>
                    </Link>
                </li>
            )
        );
        return categoriesArray;
    }

    render() {
        return (
            <div className="configure-page max-width">
                <h3 ref="allCategoriesHeading" className="t-center t-bold">
                    {this.props.allCategoriesPageStrings.allCategoriesHeading}
                </h3>
                <div className="categories">
                    <ul className="cat-list t-center">
                        {this.renderCategoryLists()}
                    </ul>
                </div>
            </div>
        );
    }
}

AllCategories.displayName = "All Categories";

AllCategories.propTypes = {
    "allCategories": PropTypes.object.isRequired,
    "allCategoriesPageStrings": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return { "allCategories": store.allCategories, "allCategoriesPageStrings": store.configurePageLocale.allCategories };
}
export default connect(select)(AllCategories);
