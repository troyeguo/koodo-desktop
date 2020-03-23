//全部图书，最近阅读，搜索结果，排序结果的数据
import React, { Component } from "react";
import "./booklist.css";
import Book from "../book/book";
import BookItem from "../bookItem/bookItem";
import { connect } from "react-redux";
import { handleFetchList } from "../../redux/manager.redux";
import RecordRecent from "../../utils/recordRecent";
import ShelfUtil from "../../utils/shelfUtil";
import SortUtil from "../../utils/sortUtil";
class BookList extends Component {
  //根据localstorage列表的数据，得到最近阅读的图书
  handleRecent = items => {
    let recentArr = [];
    for (let i in RecordRecent.getRecent()) {
      recentArr.push(RecordRecent.getRecent()[i].bookKey);
    }
    // console.log(items);
    // RecordRecent.getRecent();
    let recentItems = items.filter(item => {
      // console.log(item.key, recentArr.indexOf(item.key));

      return recentArr.indexOf(item.key) > -1;
    });
    // console.log(recentBooks);
    return recentItems;
  };
  //获取书架数据
  handleShelf(items, index) {
    //获取书架名
    let shelfTitle = Object.keys(ShelfUtil.getShelf());
    // console.log(shelfTitle, index, "shelfTitle");
    //获取当前书架名
    let currentShelfTitle = shelfTitle[index + 1];
    //获取当前书架的图书列表
    let currentShelfList = ShelfUtil.getShelf()[currentShelfTitle];
    // console.log(currentShelfList);
    //根据图书列表获取到图书数据
    let shelfItems = items.filter(item => {
      // console.log(item.key, currentShelfList.indexOf(item.key));

      return currentShelfList.indexOf(item.key) > -1;
    });

    // console.log(recentBooks);
    return shelfItems;
  }
  //控制卡片模式和列表模式的切换
  handleChange = mode => {
    // this.setState({ isList: mode });
    localStorage.setItem("isList", mode);
    this.props.handleFetchList();
  };
  //根据搜索图书index获取到搜索出的图书
  handleFilter = (items, arr) => {
    // console.log(arr, "arr");
    let itemArr = [];

    arr.forEach(item => {
      itemArr.push(items[item]);
    });
    return itemArr;
  };
  render() {
    localStorage.setItem("totalBooks", this.props.books.length);

    // console.log(this.props.isList);
    const renderBookList = () => {
      // console.log(this.props.books, "sdgasf");
      //根据不同的场景获取不同的图书数据
      let books =
        this.props.mode === "recent"
          ? this.handleRecent(this.props.books)
          : this.props.shelfIndex !== null
          ? this.handleShelf(this.props.books, this.props.shelfIndex)
          : this.props.isSearch
          ? this.handleFilter(this.props.books, this.props.searchBooks)
          : this.props.isSort
          ? this.handleFilter(
              this.props.books,
              //返回排序后的图书index
              SortUtil.sortBooks(this.props.books, this.props.sortCode)
            )
          : this.props.books;
      // console.log(this.props.covers);
      //根据不同的场景获取不同图书的封面
      let covers =
        this.props.mode === "recent"
          ? this.handleRecent(this.props.covers)
          : this.props.shelfIndex !== null
          ? this.handleShelf(this.props.covers, this.props.shelfIndex)
          : this.props.isSearch
          ? this.handleFilter(this.props.covers, this.props.searchBooks)
          : this.props.isSort
          ? this.handleFilter(
              this.props.covers,
              SortUtil.sortBooks(this.props.books, this.props.sortCode)
            )
          : this.props.covers;
      return books.map((item, index) => {
        // console.log(covers, "djhdhdfh");
        // console.log(this.props.isList, "sdgasf");
        // let mode = this.props.isList;
        // console.log(mode);
        return this.props.isList === "list" ? (
          <BookItem
            key={item.key}
            book={item}
            bookCover={covers[index] ? covers[index].url : null}
          />
        ) : (
          <Book
            key={item.key}
            book={item}
            bookCover={covers[index] ? covers[index].url : null}
          />
        );
      });
    };
    return (
      <div className="book-list-container-parent">
        <div className="book-list-container">
          <div className="book-list-view">
            <div
              className="card-list-mode"
              onClick={() => {
                this.handleChange("card");
              }}
              style={
                this.props.isList === "card"
                  ? {}
                  : { color: "rgba(75,75,75,0.5)" }
              }
            >
              <span className="icon-grid"></span> 卡片模式
            </div>
            <div
              className="list-view-mode"
              onClick={() => {
                this.handleChange("list");
              }}
              style={
                this.props.isList === "list"
                  ? {}
                  : { color: "rgba(75,75,75,0.5)" }
              }
            >
              <span className="icon-list"></span> 列表模式
            </div>
          </div>

          <div className="book-list-item-box">{renderBookList()}</div>
        </div>
      </div>
    );
  }
}
const mappropsToProps = props => {
  return {
    books: props.manager.books,
    covers: props.manager.covers,
    epubs: props.manager.epubs,
    mode: props.sidebar.mode,
    shelfIndex: props.sidebar.shelfIndex,
    searchBooks: props.manager.searchBooks,
    isSearch: props.manager.isSearch,
    isSort: props.manager.isSort,
    isList: props.manager.isList,
    sortCode: props.manager.sortCode
  };
};
const actionCreator = { handleFetchList };
BookList = connect(mappropsToProps, actionCreator)(BookList);
export default BookList;
