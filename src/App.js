import './App.css';
import { ReviewLabeller } from './components/ReviewLabeller';

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <p>Hello world 2</p>
      <ReviewLabeller
        review={'Lorem ipsu, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'}
    
      />
    </div>
  );
}

export default App;