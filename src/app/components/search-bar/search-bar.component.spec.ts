import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchQuery on input', () => {
    const input = fixture.nativeElement.querySelector('input');
    const testValue = 'test search';
    
    input.value = testValue;
    input.dispatchEvent(new Event('input'));
    
    expect(component.searchQuery).toBe(testValue);
  });

  it('should call onSearch when search button is clicked', () => {
    spyOn(component, 'onSearch');
    const button = fixture.nativeElement.querySelector('button');
    
    button.click();
    
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should log search query when onSearch is called', () => {
    spyOn(console, 'log');
    const testQuery = 'test search';
    component.searchQuery = testQuery;
    
    component.onSearch();
    
    expect(console.log).toHaveBeenCalledWith('Recherche:', testQuery);
  });
}); 